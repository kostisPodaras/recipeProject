import axios from "axios"; //instead of fetch for older browsers
import {API} from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      //axios is the excact same as fetch. But it automatically make it a json
      const res = await axios(`https://www.food2fork.com/api/search?key=${API}&q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}


