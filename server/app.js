const Koa = require('koa');
const path = require('path')
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser')
const sourceRouter = require('./src/routes/source')
const imagesRouter = require('./src/routes/images')

const app = new Koa()
const staticPath = './static'
app.use(koaBodyParser())

app.use(async (ctx, next) => {
    // console.log(ctx.URL)
    await next()
})

// 静态文件
app.use(koaStatic(path.resolve(__dirname, staticPath)))
app.use(sourceRouter.routes(), sourceRouter.allowedMethods())
app.use(imagesRouter)

app.listen(3003, () => {
    console.log('服务运行在localhost:3003 ...')
})