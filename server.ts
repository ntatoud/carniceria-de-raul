import express, { Express, Request, Response, urlencoded, static as staticSrc} from "express";

const app : Express = express();

const port = 3000;


app.use(urlencoded({extended : true}));
app.use(staticSrc('./public'));

app.set("view engine", "ejs");
app.set('views', 'src/views')

app.use('/', (req: Request, res: Response) => {
    res.render('index.ejs');
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})
