const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = { 
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace('Bearer ', '');
    
      if (!token) throw new Error();
    
      // ändra nyckeln
      // get från aws secret manager
      const data = jwt.verify(token, process.env.JWT)

      console.log(data);

      request.event.id = data.id;
      request.event.username = data.username;
    
      return request.response;

    } catch (error) {
      request.event.error = '401';
      return request.response;
    }


  },

  onError: async (request) => {
      request.event.error = '401';
      return request.response;
  }


}

module.exports = {validateToken};