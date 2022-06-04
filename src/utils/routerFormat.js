function formatRouterTree(data) {
    const accessRouters = data.filter(item => !item.hidden)
    const handle = (property) => {
        return function (a, b) {
            const val1 = a[property];
            const val2 = b[property];
            return val1 - val2;
        }
    }
    accessRouters.sort(handle('id'))
    let parentsRouter = accessRouters.filter(p => p.pid == 0),
        childrenRouter = accessRouters.filter(c => c.pid != 0)
    dataToTree(parentsRouter, childrenRouter);
    function dataToTree(parent, children) {
        parent.map(p => {
            children.map((c, i) => {
                if (c.pid === p.id) {
                    let _c = JSON.parse(JSON.stringify(children))
                    _c.splice(i, 1);
                    dataToTree([c], _c)
                    if (p.children) {
                        p.children.push(c)
                    } else {
                        p.children = [c]
                    }
                }
            })
        })
    }
    return parentsRouter
}
function generateRouter(userRouter) {
    let newRouters = userRouter.map(item => {
        let component;
        if (item.layoutComponent===1) {
            component = () => import(/* @vite-ignore */ `../layout/index.vue`)
        }else {
            component = () => import(/* @vite-ignore */ `../views/${item.name}.vue`)
        }
        let router = {
            path: item.path,
            name: item.name,
            parentName: item.parentName,
            redirect:item.redirect,
            meta: {
                link: item.link,
                icon: item.icon,
                title: item.title,
                keepAlive:+item.keepAlive === 1
            },
            component: component
        }
        if (item.children) {
            router.children = generateRouter(item.children)
        }
        return router
    })
    return newRouters
}
export {
    formatRouterTree,
    generateRouter
}
