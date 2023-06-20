const app = require("./app"),
      port = app.get("port");

app.listen(port, "localhost", ()=>{
  console.log("Server running at localhost:%d", port);
})