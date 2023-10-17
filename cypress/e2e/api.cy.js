
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
      const deviceData={
        device_id: "DMS_NLC_10",
        device_type: "DMS",
        user_uuid,
        sim_number:"7766445566"
      }
      cy.request({
        method: 'POST',
        url: `http://localhost:${PORT}/api/devices/add-device`,
        headers: {
          authorization: `bearer ${token}`
        },
      deviceData}).then(res=>{
               cy.log("successful")
        })
      


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