// --> #01 <--

  //3:13 on Video
  //SI RECIBIMOS ALGUNO DE ESTOS QUERYS, LOS BORRAMOS DE REQ.QUERY
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach(el => delete req.query[el]); 

  //En el caso de recibir como query ?price[gte]=1000, si lo pasamos a String y lo imprimimos en la consola, vamos a recibir {price: {gte: 1000}}. Con la siguiente funcion vamos a recibir {price:{ $gte: 1000  }}.
  let queryString = JSON.stringify(req.query);
  let queryStringModified = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (match)=> `$${match}`);
  
  //Al pasarlo a String con JSON, queda en formato JSON, entonces lo devolvemos a su estado original (objeto).
  const query = connection.find(JSON.parse(queryStringModified));

  //Si recibimos como query price[gte]=1000, la accion seria: -> find({price: { $gte: 1000 } })
  if(req.query.sort){
    //Si hay query SORT, solo va a tomar el primer valor, por logica.
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }else{
    //Si no recibimos el query SORT, se van a ordenar desde el creado mas recientemente, al ultimo. Es decir, desde el mas nuevo al mas viejo, en cuanto a cuando fueron creados.
    query = query.sort("-createdAt");
  }

  const product = await query;
  res.json(product);