import { lazy } from 'react';
import routeLink from './route-link';
import React from 'react';
import { Redirect } from 'react-router';

const exact = true;

export default [
    { exact, path: routeLink.admin.dashboard, component: lazy(() => import('src/views/dashboard')) },
    { exact, path: routeLink.admin.mangement.project, component: lazy(() => import('src/views/management/project')) },
    { exact, path: routeLink.admin.mangement.projectForm, component: lazy(() => import('src/views/management/project/project-form')) },
    { exact, path: routeLink.admin.mangement.projectFormEdit, component: lazy(() => import('src/views/management/project/project-form')) },
    { exact, path: routeLink.admin.mangement.board, component: lazy(() => import('src/views/management/board/board'))},
    { exact, path: routeLink.admin.mangement.roadmap, component: lazy(() => import('src/views/management/roadmap/roadmap'))},
    { exact, path: routeLink.admin.report.byproject, component: lazy(() => import('src/views/report/byproject'))},
    { exact, path: routeLink.admin.report.bystaff, component: lazy(() => import('src/views/report/bystaff'))},
    { exact, path: routeLink.admin.report.overall, component: lazy(() => import('src/views/report/overall'))},   
    { exact, path: routeLink.admin.mangement.task, component: lazy(() => import('src/views/management/task')) },
    { exact, path: routeLink.admin.mangement.taskForm, component: lazy(() => import('src/views/management/task/task-form')) },
    { exact, path: routeLink.admin.mangement.taskFormEdit, component: lazy(() => import('src/views/management/task/task-form')) },
    { component: () => <Redirect to={routeLink.error404} /> },
]