const profile = {
    dev:"http://172.20.1.80:5000",
    prod:"https://api.example.com",
    Test:"https://staging.api.example.com",
    getBaseUrl: function() {
        return process.env.NODE_ENV === 'production' ? this.prod : 
               process.env.NODE_ENV === 'Test' ? this.Test : 
               this.dev;
    }
};
export default profile;