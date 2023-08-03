// import * as Icons from '@material-ui/icons';
// import { routeLink } from 'src/routes';

const RouteNavi = [
    {
        "title": "Dashboard",
        "ordering": 1,
        "url": "/admin/dashboard",
        "state": 1,
        "children": []
    },
    {
        "title": "Project",
        "ordering": 2,
        "url": "/admin/project",
        "state": 1,
        "children": []
    },
    {
        "title": "Report",
        "ordering": 3,
        "url": "#",
        "state": 1,
        "children": [
            {
                "title": "By Project",
                "ordering": 1,
                "url": "/admin/report/project",
                "state": 1,
                "children": []
            },
            {
                "title": "By Staff",
                "ordering": 2,
                "url": "/admin/report/staff",
                "state": 1,
                "children": []
            },
            {
                "title": "Overall",
                "ordering": 1,
                "url": "/admin/report/overall",
                "state": 1,
                "children": []
            },
        ]
    }
];

export default RouteNavi;
