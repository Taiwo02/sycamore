const jwt = require('jsonwebtoken');

module.exports = {
  Auth: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (authorizationHeader != undefined) {
      const token = req.headers.authorization.split(' ')[1];
      const secret_key='hello'
      try {
        result = jwt.verify(token, secret_key);
        if(result){
            req['u_ID'] = result.user;
          next()
        } else {
          res.status(400).send({error: "You are not authorized"})
        }
        // req.decoded = result;
      } catch (err) {
        res.status(500).send(err)
        // throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
};