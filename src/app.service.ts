import { Injectable } from '@nestjs/common';
import { userDto } from './dto/user.dto';
import e from 'express';
import { json } from 'stream/consumers';
import { error } from 'console';

@Injectable()

export class AppService {
  
  
  async WidgetAmoCrm(queryParams:any){
    const {name, email, phone} = queryParams;
    if(queryParams.name==undefined||queryParams.email==undefined||queryParams.phone==undefined){
      return 'Заполните все поля'
    }
    let ContactsByEmail
    let ContactByPhone
    try{
      ContactsByEmail = await this.GetAmoCrmByEmail(queryParams.email)
      let contact = await this.patchAmoCrmContact(ContactsByEmail,queryParams.name,queryParams.email,queryParams.phone)
      return await this.postLeads(contact._embedded.contacts[0].id)
      
    }
    catch(e){
      console.log(e)
        try{
          ContactByPhone = await this.GetAmoCrmlByPhone(queryParams.phone)
          let contact = await this.patchAmoCrmContact(ContactByPhone,queryParams.name,queryParams.email,queryParams.phone)
          return await this.postLeads(contact._embedded.contacts[0].id)
        }
        catch(e){
          console.log(e)
          let contact =  await this.postAmoContact(queryParams.name,queryParams.email,queryParams.phone)
          return await this.postLeads(contact._embedded.contacts[0].id)
        }
    }
    
    
  }
    
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  async GetAmoCrmByEmail(email:string){
    const contactByEmail = await fetch(`https://aleksandrsmolencev216.amocrm.ru/api/v4/contacts?query=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMjU0YmVlMTdiZDAzZDRhMTIyNjJhNzg2YTlkZWZkNDY1NDVlOWRhNmU3MjhhM2QyZjQ3NDc4ZGYyZGI3NmU3ODVkNDNjNDZlMzI4MjRlIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiI0ZjI1NGJlZTE3YmQwM2Q0YTEyMjYyYTc4NmE5ZGVmZDQ2NTQ1ZTlkYTZlNzI4YTNkMmY0NzQ3OGRmMmRiNzZlNzg1ZDQzYzQ2ZTMyODI0ZSIsImlhdCI6MTcwMDc0MjQ4OSwibmJmIjoxNzAwNzQyNDg5LCJleHAiOjE3MDA4Mjg4ODksInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.o0cPA5-s0_62WZUdjQmO77jXL3RmbBO4srzv1a63dxYYNz_sf9V9ZZtyTALlhud5er3FOuc9cESbrWi6bA_nf7MMvATfpmzgFnuM0rYKKY8yhssfbTGTWJJpy0RztUhTlFAUit2EKPWNI7Ts9IuMzVf6umLUvPWUui_wU3Air8I9hT6C8SGuF1MH-HUv4tCfNTLy7Wp9fgLltIDOoCEt-tjC54mcA1uQkIZ1w2atHRZ_-T-2FHqaG-HSBq3sApw7K6Ihr53m20REIaamm3114P-PVdRlWFXevtHRgEMWcvkj8SiiAu2iiakPrskBT7QT35WlQGHSNiEF7YzbVuxRMA",
          'Content-Type': 'application/json',
        },
    })
    try{
      return await contactByEmail.json()
    }
    catch(e){
      console.log(e)
    }
  }
  async GetAmoCrmlByPhone(phone:string){
    const contactByPhone = await fetch(`https://aleksandrsmolencev216.amocrm.ru/api/v4/contacts?query=${phone}`, {
        method: 'GET',
        headers: {
          'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMjU0YmVlMTdiZDAzZDRhMTIyNjJhNzg2YTlkZWZkNDY1NDVlOWRhNmU3MjhhM2QyZjQ3NDc4ZGYyZGI3NmU3ODVkNDNjNDZlMzI4MjRlIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiI0ZjI1NGJlZTE3YmQwM2Q0YTEyMjYyYTc4NmE5ZGVmZDQ2NTQ1ZTlkYTZlNzI4YTNkMmY0NzQ3OGRmMmRiNzZlNzg1ZDQzYzQ2ZTMyODI0ZSIsImlhdCI6MTcwMDc0MjQ4OSwibmJmIjoxNzAwNzQyNDg5LCJleHAiOjE3MDA4Mjg4ODksInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.o0cPA5-s0_62WZUdjQmO77jXL3RmbBO4srzv1a63dxYYNz_sf9V9ZZtyTALlhud5er3FOuc9cESbrWi6bA_nf7MMvATfpmzgFnuM0rYKKY8yhssfbTGTWJJpy0RztUhTlFAUit2EKPWNI7Ts9IuMzVf6umLUvPWUui_wU3Air8I9hT6C8SGuF1MH-HUv4tCfNTLy7Wp9fgLltIDOoCEt-tjC54mcA1uQkIZ1w2atHRZ_-T-2FHqaG-HSBq3sApw7K6Ihr53m20REIaamm3114P-PVdRlWFXevtHRgEMWcvkj8SiiAu2iiakPrskBT7QT35WlQGHSNiEF7YzbVuxRMA",
          'Content-Type': 'application/json',
        },
    })
    try{
      return await contactByPhone.json()
    }
    catch(e){
      console.log(e)
    }
  }
  async postAmoContact(name,email,phone){
    let postAmoCrm = await fetch('https://aleksandrsmolencev216.amocrm.ru/api/v4/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMjU0YmVlMTdiZDAzZDRhMTIyNjJhNzg2YTlkZWZkNDY1NDVlOWRhNmU3MjhhM2QyZjQ3NDc4ZGYyZGI3NmU3ODVkNDNjNDZlMzI4MjRlIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiI0ZjI1NGJlZTE3YmQwM2Q0YTEyMjYyYTc4NmE5ZGVmZDQ2NTQ1ZTlkYTZlNzI4YTNkMmY0NzQ3OGRmMmRiNzZlNzg1ZDQzYzQ2ZTMyODI0ZSIsImlhdCI6MTcwMDc0MjQ4OSwibmJmIjoxNzAwNzQyNDg5LCJleHAiOjE3MDA4Mjg4ODksInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.o0cPA5-s0_62WZUdjQmO77jXL3RmbBO4srzv1a63dxYYNz_sf9V9ZZtyTALlhud5er3FOuc9cESbrWi6bA_nf7MMvATfpmzgFnuM0rYKKY8yhssfbTGTWJJpy0RztUhTlFAUit2EKPWNI7Ts9IuMzVf6umLUvPWUui_wU3Air8I9hT6C8SGuF1MH-HUv4tCfNTLy7Wp9fgLltIDOoCEt-tjC54mcA1uQkIZ1w2atHRZ_-T-2FHqaG-HSBq3sApw7K6Ihr53m20REIaamm3114P-PVdRlWFXevtHRgEMWcvkj8SiiAu2iiakPrskBT7QT35WlQGHSNiEF7YzbVuxRMA"
      },
      body: JSON.stringify([
        {
            name: name,
            custom_fields_values: [
                { 
                field_id: 1479213,
                values: [
                    {
                        value: email
                    }
                  ]
                },
                {
                    field_id: 1479211,
                    values: [
                        {
                            value: phone
                        }
                    ]
                }
            ]
        }
    ]),
    });
    return await postAmoCrm.json()
  }
  async patchAmoCrmContact(contact,name,email,phone){
    let UpdateAmoCrm = [{
      id: contact._embedded.contacts[0].id,
      name:name,
      custom_fields_values: [
        {
          field_id: 1479213,
          field_name: "Email",
          values: [
            {
              value: email,
              enum_code: "WORK"
            }
          ]
        },
        {
          field_id: 1479211,
          field_name: "Телефон",
          values: [
            {
              value: phone,
              enum_code: "WORK"
            }
          ]
        }

      ]
    }]
    let patchAmoCrm = await fetch('https://aleksandrsmolencev216.amocrm.ru/api/v4/contacts', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMjU0YmVlMTdiZDAzZDRhMTIyNjJhNzg2YTlkZWZkNDY1NDVlOWRhNmU3MjhhM2QyZjQ3NDc4ZGYyZGI3NmU3ODVkNDNjNDZlMzI4MjRlIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiI0ZjI1NGJlZTE3YmQwM2Q0YTEyMjYyYTc4NmE5ZGVmZDQ2NTQ1ZTlkYTZlNzI4YTNkMmY0NzQ3OGRmMmRiNzZlNzg1ZDQzYzQ2ZTMyODI0ZSIsImlhdCI6MTcwMDc0MjQ4OSwibmJmIjoxNzAwNzQyNDg5LCJleHAiOjE3MDA4Mjg4ODksInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.o0cPA5-s0_62WZUdjQmO77jXL3RmbBO4srzv1a63dxYYNz_sf9V9ZZtyTALlhud5er3FOuc9cESbrWi6bA_nf7MMvATfpmzgFnuM0rYKKY8yhssfbTGTWJJpy0RztUhTlFAUit2EKPWNI7Ts9IuMzVf6umLUvPWUui_wU3Air8I9hT6C8SGuF1MH-HUv4tCfNTLy7Wp9fgLltIDOoCEt-tjC54mcA1uQkIZ1w2atHRZ_-T-2FHqaG-HSBq3sApw7K6Ihr53m20REIaamm3114P-PVdRlWFXevtHRgEMWcvkj8SiiAu2iiakPrskBT7QT35WlQGHSNiEF7YzbVuxRMA"
    },
    body: JSON.stringify(UpdateAmoCrm),
  });
  return await patchAmoCrm.json()
  }
  async postLeads(contact_id){
    let leadsAmoCrmObj = [
      {
          name: "Сделка",
          price: 20000,
          stage: "new",
          _embedded: {
            contacts: [
                {
                    id: contact_id
                }
            ]
          }
      },
  ]
    let leadsAmoCrm = await fetch('https://aleksandrsmolencev216.amocrm.ru/api/v4/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMjU0YmVlMTdiZDAzZDRhMTIyNjJhNzg2YTlkZWZkNDY1NDVlOWRhNmU3MjhhM2QyZjQ3NDc4ZGYyZGI3NmU3ODVkNDNjNDZlMzI4MjRlIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiI0ZjI1NGJlZTE3YmQwM2Q0YTEyMjYyYTc4NmE5ZGVmZDQ2NTQ1ZTlkYTZlNzI4YTNkMmY0NzQ3OGRmMmRiNzZlNzg1ZDQzYzQ2ZTMyODI0ZSIsImlhdCI6MTcwMDc0MjQ4OSwibmJmIjoxNzAwNzQyNDg5LCJleHAiOjE3MDA4Mjg4ODksInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.o0cPA5-s0_62WZUdjQmO77jXL3RmbBO4srzv1a63dxYYNz_sf9V9ZZtyTALlhud5er3FOuc9cESbrWi6bA_nf7MMvATfpmzgFnuM0rYKKY8yhssfbTGTWJJpy0RztUhTlFAUit2EKPWNI7Ts9IuMzVf6umLUvPWUui_wU3Air8I9hT6C8SGuF1MH-HUv4tCfNTLy7Wp9fgLltIDOoCEt-tjC54mcA1uQkIZ1w2atHRZ_-T-2FHqaG-HSBq3sApw7K6Ihr53m20REIaamm3114P-PVdRlWFXevtHRgEMWcvkj8SiiAu2iiakPrskBT7QT35WlQGHSNiEF7YzbVuxRMA"
    },
    body: JSON.stringify(leadsAmoCrmObj),
  });
  return await leadsAmoCrm.json()
  }
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  async postAuthKey(){
    let AuthKey = await fetch('https://aleksandrsmolencev216.amocrm.ru/oauth2/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          client_id:"c50356de-edb1-4b98-b9a5-cd251a4b59bd",
          client_secret: "VOdS0Vw8OoJEsx4xsnALVtkeNAvcL2nCBXIS0YcH6U8hyl7PEY2e1kjwGHYCTUmJ",
          grant_type:"authorization_code",
          code: "def502004de638eb025fc82813532fe121b4043150bdb55cb444c54a258a99b6b29ce87ecfaae3e69acaf3e1bef53fe0e73931eebf06c7db40d3088cb6b6c4828657a8b01e28b4dbaf1e671e7eab61c7457ee87cfb12eee4c2b9d057fbbfe9f2dc3495b5c9e04212a490eefd36da3e4d347b1e64290bf2e976bceb2143b1b2007374f4a25a0699d463f132b6acf70e5e2725974641ea78aaa67021fd29678258b66e555216893a7721b973d47b11ea8e85c1d4691e5757be588135cbef4eee5638d0779d1c0363bb80fd16856bbfdbb859dd583f73dcffdcb235bbff0be833bfbc320d72b991a267a5d20bbc90e91fee8ab00cf587e388ed5dc28219d7a53bbe22ef333f0c67e564fe70bd4bed59a3c5d02d10630fc1aeacf06403d274507fbf8d7b10ca7e8f6d9703f4efc1e98dde3f49e66d6063744d6eb2834a1a2a3bc9459fc99f14762f4503407ebf3e23c7c3aa8c06ff46246477da2d95cb016382e898bfa701d7b627733594ca0784f61a448a350cbdfe8acf3923eac20ffebed997a0d5d29dd29a444f1d8fa43cdbf6547e4c1cbe3f4f7b58de1787571bdabf884d2257c0e4584b0e2f014598add859d2f29967e51f42bb5bac778660ddab72bc0600839f6a59678a02a64e50893699439aeae5cfa667cc9b7c7f5952ee5724e43bd4675ba5f30cb1828692906bc212a33329e77f6edc318e9fc5e596014f08"
        }),
    });
    return await AuthKey.json()
  }
  async refreshAuthAcees(){
    let AuthKey = await fetch('https://aleksandrsmolencev216.amocrm.ru/oauth2/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          client_id:"c50356de-edb1-4b98-b9a5-cd251a4b59bd",
          client_secret: "VOdS0Vw8OoJEsx4xsnALVtkeNAvcL2nCBXIS0YcH6U8hyl7PEY2e1kjwGHYCTUmJ",
          grant_type:"refresh_token",
          refresh_token: "def502004ee982dda14be8223c9c4e288fc7416dd5265fd19618e2df112ca6cce80f25be34f928eb253d6639fe514309af4b8b63b1612b86c8d7f3fa3279969eafce510715466b3c4f1c2da1a1249183343db7dca465714f8eb75b5f6930afa7eaa1f7a34df4bb55a5712381066bfe0dc793c6179f19b1419462cfa9c64d8e160fe25748fbf6c40c85d78f1020dbd44863205d84e8c72c11149a0d4d729bca980e7c297fc95573a8c1316665db04389188f99037e0a46aecd638bea6b645eb0dcbf43c9245757b9781dab9a4c091a2d2421d3df767493396cd9e95c4d58e3b428655705a6ab1c5b5098ff387e799e1a9e817708680d2dff869d2fbea75a7f11f54130fe599d7b58346b3a3898286c39e4717aaec647e5f9777124fec2be911fe1fcf2d4c2100dd11e146e67b0375dd4655f6941767f5a5976521ac244e8d5ea4e1b75aed9aede1c71d381f4cad863fc590af6455052d385d02c70052b2590304301b62946739d4872a6d405188912437ea963f274c43c2932ce4ab89fb6f1137cbee894396566ab71d1a0cf9bf66db1395170f73037a70c403f89820d9c13930a6c7797c89c7a25b56ad8e8e7f27985d1f36943853f941c63667de23bd2016e6842953002c615afdcc1b3e4b4a8147b71662f74eb93ca5d462cd9b6e9bfaf5c5ea70f347e0892bf2655cdab24179"
        }),
    });
    return await AuthKey.json()
  }
  async getCustomFiled(){
    const CustomFields =  await fetch(`https://aleksandrsmolencev216.amocrm.ru//api/v4/contacts/custom_fields`, {
      method: 'GET',
      headers: {
          'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFiYjUxNDY5Zjk1MmZhNWM0MjU1NTgzNzU4NTNmMmY4ODMyMTNhZDhiYzdlNjdhNmFmZTkxYTliMjNlMzgzYmY3YTNjMDkwZDFkOTk3MzljIn0.eyJhdWQiOiJjNTAzNTZkZS1lZGIxLTRiOTgtYjlhNS1jZDI1MWE0YjU5YmQiLCJqdGkiOiIxYmI1MTQ2OWY5NTJmYTVjNDI1NTU4Mzc1ODUzZjJmODgzMjEzYWQ4YmM3ZTY3YTZhZmU5MWE5YjIzZTM4M2JmN2EzYzA5MGQxZDk5NzM5YyIsImlhdCI6MTcwMDY1MjQ1MywibmJmIjoxNzAwNjUyNDUzLCJleHAiOjE3MDA3Mzg4NTMsInN1YiI6IjEwMzY0MTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNDE4NTcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.jDinqFR_G6pcEhAmVl8WydyPjQ0XfqvLwwYzGA5uP8ZXnzKQl1d63LtvqSwdSOatixABz95grvLzg6ae1bq02LE8R8n7ryJ35IuvIZRQAEYrQbpAk3u_5um_ynxRU0hclm0AN3BTmdNYK0kn_-Qicw2BZ3pdlHbiIfh1a-nEX9hoHi0AdNi9mI6Xf5yUOl83Y5TVy9g-o3YxcGk9pTpu5acmEP2HnF6SAx2-neduI21jIDsTc8pGqyMAZI3y74mWPue6QO8CHZ_d5scf7XJ9vdOaPi8NtBbFBm0_0kIo_OArmfEuBdiRQDXZmkH695AmCogePLXVniAjhIxSbuaCkA",
          'Content-Type': 'application/json',
      },
  })
  return await CustomFields.json()
  }
}
