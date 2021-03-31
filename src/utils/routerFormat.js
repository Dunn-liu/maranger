function formatRouterTree (data) {
    let parentsRouter = data.filter(p=>p.pid == 0),
        childrenRouter = data.filter(c=>c.pid !=0)
    dataToTree(parentsRouter,childrenRouter);
    function dataToTree(parent,children){
        parent.map(p=>{
            children.map((c,i)=>{
              if(c.pid === p.id) {
                  let _c = JSON.parse(JSON.stringify(children))
                  _c.splice(i,1);
                  dataToTree([c],_c)
                  if (p.children){
                      p.children.push(c)
                  }else{
                      p.children = [c]
                  }
              }
            })
        })
    }
    return parentsRouter
}
function generateRouter (userRouter) {
    let newRouters = userRouter.map(item=>{
        let router = {
            path:item.path,
            name:item.name,
            parentName:item.parentName,
            meta:{
                link:item.link,
                icon:item.icon,
                title:item.title,
            },
            component:()=>import(/* @vite-ignore */ `../views/layout/${item.name}.vue`)
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
