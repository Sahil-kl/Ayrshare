import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const axios = require('axios')

@Injectable()
export class AyrshareService {
    API_KEY : string
    constructor( private config: ConfigService ){
        this.API_KEY = this.config.get('API_KEY')
    }
    async getPostById(id) {
        // console.log(`${this.config.get('X_CLIENT_ID')}`,`${this.config.get('X_API_KEY')}`)
        let post = await axios.request({
          url: `https://app.ayrshare.com/api/post/${id}`,
          method: 'get',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
        }).catch(console.error)

        if (post) {
          return post.data;
        }
        return post.error;
    
      }
}
