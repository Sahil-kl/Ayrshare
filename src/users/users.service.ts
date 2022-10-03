import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
const axios = require('axios').default
let qs = require('qs');


@Injectable()
export class UsersService {
  API_KEY : string
    constructor( private config: ConfigService ){
        this.API_KEY = this.config.get('API_KEY')
    }

  async create(title) {
    try {
      let user = await  axios.post(`https://app.ayrshare.com/api/profiles/profile`,
        {"title": title},
        {"headers": { 
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        } 
      })
      console.log(user)
      if (user) {
        return user.data;
      }
      return false;
    }catch(err){
      return err.response.data
    }
  }

  async generateJWT(profilKey) {
    try {
      const key = this.config.get('PRIVATE_KEY')
      const domain = this.config.get('DOMAIN')

      console.log(profilKey,key,domain)

      let config = {
        method: 'post',
        url: 'https://app.ayrshare.com/api/profiles/generateJWT',
        headers: { 
          'Authorization': `Bearer ${this.API_KEY}`, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : qs.stringify({
          'domain': domain,
          'privateKey': key,
          'profileKey': profilKey 
        })
      };
      
      let user = await axios(config)
      console.log(user)
      if (user) {
        return user.data;
      }
      return false;
  }catch(err){
    return err.response.data
  }
}

  async findAll() {
    try {
      let user = await  axios.get(`https://app.ayrshare.com/api/profiles`,
        {headers: { 
          'Authorization': `Bearer ${this.API_KEY}`,
        } 
      })
      if (user) {
        return user.data;
      }
      return false;
    }catch(err){
      return err.response.data
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id) {
    try {
      console.log(id)
      console.log(this.API_KEY)
      let user = await axios.delete(`https://app.ayrshare.com/api/profiles/profile`,{
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        data: {
          profileKey :id
        }
      })
      if (user) {
        return user.data;
      }
      return false;
    }catch(err){
      // console.log('err=====>', err.response.data)
      return err.response.data
    }
  }
}
