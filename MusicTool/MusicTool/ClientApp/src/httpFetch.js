// NOTICE: Not support IE
class HttpFetch {
  queryString = (params = {}) => {
    return Object.keys(params).map((key) => `${params[key]}`).join('&')
  }
  ajax = async (url, { method = 'get', params, data = {} } = {}) => {
    const qs = this.queryString(params);
    const _url = qs ? url + "/?" + qs : url;
    const options = {
      method, // *GET, POST, PUT, DELETE, etc.
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
    if (method.toLowerCase() === 'get') {
      delete options.body
    }

    const response = await fetch('api' + _url, options);
    if (response.ok) {
      return response.json(); // parses JSON response into native JavaScript objects
    } else {
      const error = await response.json();
      const { message } = error;
      console.log('url:', url, error)
      alert(message)

      // throw Error(message);
      return Promise.reject(error.message)
    }
  }


  get = (url, params) => this.ajax(url, { method: 'get', params })
  post = (url, { params, data }) => this.ajax(url, { method: 'post', params, data })
  delete = (url, { params, data }) => this.ajax(url, { method: 'delete', params, data })
  put = (url, { params, data }) => this.ajax(url, { method: 'put', params, data })


  setValue = (key, value) => {
    if (!key) {
      return;
    }
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }

  getValue = (key) => {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (ex) {
      return value;
    }
  }

  getUserId = () => this.getValue('userId')
  setUserId = (id) => this.setValue('userId', id)

  getUserEmail = () => this.getValue('userEmail')
  setUserEmail = (email) => this.setValue('userEmail', email)
}

export default new HttpFetch()