const app = require("./app"),
      port = app.get("port");

app.listen(port, ()=>{
  console.log("Server running at localhost:%d", port);
})