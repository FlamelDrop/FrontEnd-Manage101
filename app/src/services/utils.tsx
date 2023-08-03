import { parseInt } from 'lodash';
import moment from 'moment';
import { parse } from 'querystring';
import { AppConfig } from 'src/configs';

export interface Menus {
  id: number;
  parentId: number;
  title: string;
  positionId: number;
  ordering: number;
  url: string;
  param: string;
  state: number;
  children: any[];
}

export const removeExtension = (filename: string) => {
  return filename.split('.').slice(0, -1).join('.');
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getCrumbs = (menus: any, path: string | undefined): any[] => {
  let crumbs: any[] = [];
  if (!path) {
    return crumbs;
  }

  const segment = path.slice(1).split('/')
  const segmentLast = segment[segment.length - 1]
  var segmentPath = "/";
  if (segmentLast !== 'create' && segmentLast.replace(/[^0-9]/g, "") === "") {
    if (segmentLast === 'task' || segmentLast === 'roadmap' || segmentLast === 'board') {
      segmentPath = segmentLast
    } else {
      for (var i = 0; i < segment.length; i++) {
        if (i + 1 !== segment.length) {
          segmentPath += `${segment[i]}/`
        } else {
          segmentPath += `${segment[i]}`
        }
      }
    }
  } else {
    let segmentSecondLast = segment[segment.length - 2]
    if (segmentSecondLast === 'edit') {
      segmentSecondLast = segment[segment.length - 3]
    }
    if (segmentSecondLast === 'task') {
      segmentPath = segmentSecondLast
    } else {
      const index = segment.indexOf('edit');
      if (index > -1) {
        segment.splice(index, 1);
      }
      for (i = 0; i < segment.length - 1; i++) {
        if (i + 1 !== segment.length - 1 && segment[i] !== 'edit') {
          segmentPath += `${segment[i]}/`
        } else {
          segmentPath += `${segment[i]}`
        }
      }
    }
  }

  if (menus.length > 0) {
    const children_one = menus.filter((i: any) => i.url === segmentPath)[0];
    if (children_one === undefined) {
      if (segmentPath === `task` || segmentPath === `roadmap` || segmentPath === `board`) {
        crumbs.push({ title: 'Home' })
        crumbs.push({ title: 'Project', link: '/admin/project' })
        crumbs.push({ title: capitalizeFirstLetter(segmentPath), link: '' })
        if (segmentLast.search('create') !== -1) {
          const projectId = segment[segment.length - 3]
          if (projectId.replace(/[^0-9]/g, "") !== "") {
            crumbs[2].link = `/admin/project/${projectId}/task`
          }
          crumbs.push({ title: `Create ${capitalizeFirstLetter(segmentPath)}`, link: '#' });
        } else if (segmentLast.replace(/[^0-9]/g, "") !== "") {
          const projectId = segment[segment.length - 4]
          if (projectId.replace(/[^0-9]/g, "") !== "") {
            crumbs[2].link = `/admin/project/${projectId}/task`
          }
          crumbs.push({ title: `Edit ${capitalizeFirstLetter(segmentPath)}`, link: '#' });
        }
      }
      menus.forEach((item: any) => {
        const search = item.url.search(segmentPath)
        if (search === -1 && item.children.length > 0) {
          const children_one = item.children.filter((i: any) => i.url === segmentPath)[0]
          if (children_one !== undefined && Object.keys(children_one).length > 0) {
            crumbs.push({ title: 'Home' })
            if (children_one !== undefined && Object.keys(children_one.parent).length > 0) {
              crumbs.push({ title: children_one.parent.title })
            }
            crumbs.push({ title: children_one.title, link: children_one.url })
            if (segmentLast.search('create') !== -1) {
              crumbs.push({ title: `Create ${capitalizeFirstLetter(children_one.title)}`, link: '#' });
            } else if (segmentLast.replace(/[^0-9]/g, "") !== "") {
              crumbs.push({ title: `Edit ${capitalizeFirstLetter(children_one.title)}`, link: '#' });
            }
          }
        }
      })
    } else {
      crumbs.push({ title: 'Home' })
      crumbs.push({ title: children_one.title, link: children_one.url })
      if (segmentLast.search('create') !== -1) {
        crumbs.push({ title: `Create ${capitalizeFirstLetter(children_one.title)}`, link: '#' });
      } else if (segmentLast.replace(/[^0-9]/g, "") !== "") {
        crumbs.push({ title: `Edit ${capitalizeFirstLetter(children_one.title)}`, link: '#' });
      }
    }
  }
  return crumbs;
};

if (process.env.NODE_ENV === 'production') {
  console.log = () => { };
}

export const toAbsoluteUrl = (pathname: string) => process.env.REACT_APP_PUBLIC_URL + pathname;

export const priceFormat = (amount: any) => {
  if (amount === null || amount === '' || isNaN(Number(amount)))
    return '0.00'

  try {
    return amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (e) {
    return parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export const generateTask = (datas: any[], genDatas: any[], parentId: number, level: number) => {
  let tasks: any[] = [];
  if (datas.length > 0) {
    if (level === 0) {
      tasks = datas.filter(function (dataParent: any) {
        return dataParent.parent_id === 0
      }).sort((n1: any, n2: any) => {
        if (n1.start_date > n2.start_date) {
          return 1;
        }
        if (n1.start_date < n2.start_date) {
          return -1;
        }
        return 0
      })
    } else {
      if (genDatas) {
        tasks = datas.filter(function (dataChildren: any) {
          return dataChildren.parent_id === parentId
        }).sort((n1: any, n2: any) => {
          if (n1.start_date > n2.start_date) {
            return 1;
          }
          if (n1.start_date < n2.start_date) {
            return -1;
          }
          return 0
        })
      }
    }

    if (tasks.length > 0) {
      tasks.map((item: any, key: number) => {
        if (level === 0) {
          genDatas.push({
            id: item.id,
            no: `${key + 1}`,
            noroad: `${key + 1}`,
            parentId: item.parent_id,
            title: item.title,
            start_date: moment(item.start_date).format('DD/MM/YY'),
            end_date: moment(item.end_date).format('DD/MM/YY'),
            level: level,
            sprint_id: item.sprint_id,
            status: item.status,
            task_id_resource: item.task_id_resource,
            children: []
          })
        }
        if (level === 1) {
          const parent = genDatas.find(e => e.id === parentId);
          genDatas.push({
            id: item.id,
            no: `${parent.no}.${key + 1}`,
            noroad: `\xa0\xa0${parent.no}.${key + 1}`,
            parentId: item.parent_id,
            title: item.title,
            start_date: item.start_date,
            end_date: item.end_date,
            level: level,
            sprint_id: item.sprint_id,
            status: item.status,
            task_id_resource: item.task_id_resource,
            children: []
          })
        }
        if (level === 2) {
          const parent = genDatas.find(e => e.id === parentId);
          genDatas.push({
            id: item.id,
            no: `${parent.no}.${key + 1}`,
            noroad: `\xa0\xa0\xa0\xa0${parent.no}.${key + 1}`,
            parentId: item.parent_id,
            title: item.title,
            start_date: item.start_date,
            end_date: item.end_date,
            level: level,
            sprint_id: item.sprint_id,
            status: item.status,
            task_id_resource: item.task_id_resource,
            children: []
          })
        }
        if (level === 3) {
          const parent = genDatas.find(e => e.id === parentId);
          genDatas.push({
            id: item.id,
            no: `${parent.no}.${key + 1}`,
            noroad: `\xa0\xa0\xa0\xa0\xa0\xa0${parent.no}.${key + 1}`,
            parentId: item.parent_id,
            title: item.title,
            start_date: item.start_date,
            end_date: item.end_date,
            level: level,
            sprint_id: item.sprint_id,
            status: item.status,
            task_id_resource: item.task_id_resource,
            children: []
          })
        }

        const taskChildren = datas.filter(function (children: any) {
          return children.parent_id === item.id
        })

        if (taskChildren.length > 0 && level <= 2) {
          generateTask(datas, genDatas, item.id, level + 1)
        }

        return true

      })
    }
  }
  return genDatas
}

export const generateTaskChildren = (datas: any[], genDatas: any[], parentKey: number, level: number) => {
  let tasks: any[] = [];

  if (datas.length > 0) {
    if (level === 0) {
      tasks = datas.filter(function (dataParent: any) {
        return dataParent.parent_id === 0
      }).sort((n1: any, n2: any) => {
        if (n1.id > n2.id) {
          return 1;
        }
        if (n1.id < n2.id) {
          return -1;
        }
        return 0
      })
    } else {
      if (genDatas) {
        tasks = datas.filter(function (dataChildren: any) {
          return dataChildren.parent_id === genDatas[parentKey].id
        }).sort((n1: any, n2: any) => {
          if (n1.id > n2.id) {
            return 1;
          }
          if (n1.id < n2.id) {
            return -1;
          }
          return 0
        })
      }
    }

    if (tasks.length > 0) {
      tasks.map((item: any, key: number) => {
        if (level === 0) {
          genDatas.push({
            id: item.id,
            no: `${key + 1}`,
            parentId: item.parent_id,
            title: item.title,
            start_date: item.start_date,
            end_date: item.end_date,
            level: level,
            children: []
          })
        } else {
          if (genDatas[parentKey]) {
            genDatas[parentKey].children.push({
              id: item.id,
              no: `${genDatas[parentKey].no}.${key + 1}`,
              parentId: item.parent_id,
              title: item.title,
              start_date: item.start_date,
              end_date: item.end_date,
              level: level,
              children: []
            })
          }
        }

        const taskChildren = datas.filter(function (children: any) {
          return children.parent_id === item.id
        })

        if (taskChildren.length > 0) {
          if (level === 0) {
            generateTaskChildren(datas, genDatas, key, level + 1)
          } else if (level <= 2) {
            generateTaskChildren(datas, genDatas[parentKey].children, key, level + 1)
          }
        }

        return true

      })
    }
  }
  return genDatas
}

export const isLoginScreen =
  process.env.NODE_ENV === 'development'
    ? window.location.origin === 'http://localhost:3000' && (AppConfig.app as any).login === true
    : window.location.origin === process.env.REACT_APP_WEB_HOST;
