const routeLink = {
    logout: '/logout',
    authen: '/authen',
    error404: '/404',
    admin: {
        admin: '/admin',
        login: '/admin/login',
        dashboard: '/admin/dashboard',
        mangement: {
            project: '/admin/project',
            projectForm: '/admin/project/create',
            projectFormEdit: '/admin/project/edit/:projectId',
            task: '/admin/project/:projectId/task',
            taskForm: '/admin/project/:projectId/task/create',
            taskFormEdit: '/admin/project/:projectId/task/edit/:taskId',
            roadmap: '/admin/project/:projectId/roadmap',
            board: '/admin/project/:projectId/board',
        },
        report: {
            byproject: '/admin/report/byproject',
            bystaff: '/admin/report/bystaff',
            overall: '/admin/report/overall',
        }
    }
};

export default routeLink