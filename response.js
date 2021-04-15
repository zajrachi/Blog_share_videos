module.exports = {
    responseSuccess: function (data) {
      return {
          status:'SUCCESS',
          data: data,
      } 
      
    },
    responseError: function (data) {
      return {
          status:'ERROR',
          data: data,
      } 
      
    }
  }