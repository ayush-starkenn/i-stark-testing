
const PORT = 8080;
describe("testing the whole bunch of different apis" , ()=>{
  it("testing the user_controllers" , ()=>{
    //code for testing the login function
    cy.request("POST" , `http://localhost:${PORT}/api/login`, {email : "piyush@starkenn.com" , password : "qwerty"}).then((res)=>{
      cy.wrap(res.body).should('have.property' , 'message' , 'Login successful!');
      cy.wrap(res.body.user).should('have.property' , 'user_uuid');
      cy.wrap(res.body).should('have.property' , 'token' );
      const token  = res.body.token;
      const user_uuid = res.body.user.user_uuid;

      // till here we got logged in and got the token 

      //--> doing for the customer-Controller
      cy.request({
  method: 'GET',
  url: `http://localhost:${PORT}/api/customers/get-all-customer`,
  headers: {
    authorization: `bearer ${token}`
  }
}).then((res)=>{
  cy.log(res.body);
  cy.wrap(res.body).should('have.property' , 'total_count');
  cy.wrap(res.body.customerData).each((ele)=>{
  cy.wrap(ele).should('have.property' , 'user_id');
  cy.wrap(ele).should('have.property' , 'user_uuid');
  cy.wrap(ele).should('have.property' , 'first_name');
  cy.wrap(ele).should('have.property' , 'last_name');
  cy.wrap(ele).should('have.property' , 'email');
  cy.wrap(ele).should('have.property' , 'user_type');
  cy.wrap(ele).should('have.property' , 'company_name');
  cy.wrap(ele).should('have.property' , 'address');
  cy.wrap(ele).should('have.property' , 'state');
  cy.wrap(ele).should('have.property' , 'city');
  cy.wrap(ele).should('have.property' , 'pincode');
  cy.wrap(ele).should('have.property' , 'phone');
  cy.wrap(ele).should('have.property' , 'user_status');
  cy.wrap(ele).should('have.property' , 'created_at');
  cy.wrap(ele).should('have.property' , 'created_by');
  cy.wrap(ele).should('have.property' , 'modified_at');
  cy.wrap(ele).should('have.property' , 'modified_by');})

});


    //now doing it for the customer update
    // const updatedData= {
    //   first_name:"piyush",
    //   last_name:"akotkar",
    //   email:"piyush@starkenn.com",
    //   company_name:"starkenn Technoloies",
    //   address:"malik nagar",
    //   state:"seth jii",
    //   city: "gumnaam",
    //   pincode: 411038,
    //   phone: 9897875655,
    //   userUUID: user_uuid,
    // }
    // cy.request({
    //   method: 'PUT',
    //   url: `http://localhost:${PORT}/api/customers/update-customer/${user_uuid}`,
    //   headers: {
    //     authorization: `bearer ${token}`
    //   },
    //   updatedData
    // }).then((res)=>{
    //   cy.log(res.message);
    // })

    //doing for get customer by id
     cy.request({
      method: 'GET',
      url: `http://localhost:${PORT}/api/customers/get/${user_uuid}`,
      headers: {
        authorization: `bearer ${token}`
      }
    }).then((res)=>{
      cy.wrap(res.body.customerData).each((ele)=>{
        cy.wrap(ele).should('have.property', 'user_uuid', user_uuid)
      })
    })

    //doing it for total Customer-count
    cy.request({
      method: 'GET',
      url: `http://localhost:${PORT}/api/customers/total-customers`,
      headers: {
        authorization: `bearer ${token}`
      }}).then((res)=>{
        cy.wrap(res.body.result).each((ele)=>{
          cy.wrap(ele).should('have.property', 'count');
        })
      })


      //Devices #

      //add devices
      let rn = Math.random().toFixed(2);
      rn = rn*100;
      cy.log('printing user uuid: ', user_uuid);
      const deviceData={
        device_id: `DMS_NLC_${rn}`,
        device_type: "DMS",
        user_uuid:user_uuid,
        sim_number:`77664${rn}`,
        status:"2",
        userUUID: user_uuid
      }

      const EditdeviceData={
        device_id: `DMS_NLC_${rn}`,
        device_type: "DMS",
        user_uuid:user_uuid,
        sim_number:`77664${rn}`,
        status:"2",
        userUUID: user_uuid
      }

     cy.request({
        method: 'POST',
        url: `http://localhost:${PORT}/api/devices/add-device`,
        headers: {
          authorization: `bearer ${token}`
        },
      body: deviceData}).then((res)=>{
        cy.log("successfully stored");
      })

      // edit device
      cy.request({
        method: 'PUT',
        url: `http://localhost:${PORT}/api/devices/edit-device/${deviceData.device_id}`,
        headers: { authorization: `bearer ${token}` },
        body: EditdeviceData // Use "headers" instead of "header"
      }).then(() => {
        cy.log("Successfully Edited the device");
      });


      //delete the device
      cy.request({
        method: 'PUT',
        url: `http://localhost:${PORT}/api/devices/delete-device/${deviceData.device_id}`,
        headers: { authorization: `bearer ${token}` },
        body: deviceData // Use "headers" instead of "header"
      }).then((res) => {
        cy.wrap(res.status).should('eq', 201);
      });

      //get list of all devices
      cy.request({
        method: 'GET',
        url: `http://localhost:${PORT}/api/devices/list-devices`,
        headers: { authorization: `bearer ${token}` }
      }).then((res) => {
        cy.wrap(res.body.devices).each(e=>{
          cy.log(e.device_id)
             
              //get device by id
      cy.request({
        method: 'GET',
        url: `http://localhost:${PORT}/api/devices/get-device-by-id/${e.device_id}`,
        headers: { authorization: `bearer ${token}` }
      }).then((res) => {
        cy.wrap(res.body.device).each(f=>{
          cy.wrap(f.device_id).should('eq', e.device_id)
        })
      });


        })
      });

      //get customer list
      cy.request({
        method: 'GET',
        url: `http://localhost:${PORT}/api/devices/get-customerlist`,
        headers: { authorization: `bearer ${token}` }
      }).then((res) => {
        // Check if each object in the response body has the expected properties
        res.body.users.forEach((user) => {
          expect(user).to.have.property('user_uuid');
          expect(user).to.have.property('first_name');
          expect(user).to.have.property('last_name');
        });
      });

      //get user device list
      cy.request({
        method: 'GET',
        url: `http://localhost:${PORT}/api/devices/get-user-devices-list/${user_uuid}`,
        headers: { authorization: `bearer ${token}` }
      }).then((res) => {
        // Check if each object in the response body has the expected properties
        res.body.results.forEach((ress) => {
          expect(ress).to.have.property('device_id');
          expect(ress).to.have.property('device_type');
        });
      });

      //get user ecu
      cy.request({
        method: 'GET',
        url: `http://localhost:${PORT}/api/devices/get-user-ecu/${user_uuid}`,
        headers: { authorization: `bearer ${token}` }
      }).then((res) => {
        // Check if each object in the response body has the expected properties
        cy.log(res.body.message);
      });



      //doing it for delete customer--> this would be done in the ending of the testing
      
      // doing it for logout
      // cy.request({
      //   method: 'GET',
      //   url: `http://localhost:${PORT}/api/customers/logout`,
      //   headers: {
      //     authorization: `bearer ${token}`
      //   }}).then(res=>{
      //     cy.log(res.body.message)
      //   })

  })

})
})