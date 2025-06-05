const express = require('express');



const app = express();
const port = 3000;  
app.use((req,res)=>{
    res.send('Hello, World!');
})
app.use("/hello", (req, res) => {
  res.send('Hello from /hello route!'); 
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});