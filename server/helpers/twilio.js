import twilio from "twilio";

export const sendOtp = async(phone,otp)=>{

try{

    const client = twilio(
        process.env.TWILIO_SID,

        process.env.TWILIO_AUTH_TOKEN
    );


    const message = await client.messages.create({
        body: `your otp is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,  
    })

      console.log("OTP sent:", message.sid);
    return true;


}
catch(err){
    console.log(err)
}


}



export const sendConfirmcomplaint = (phone,link, complaintId)=>{

    try{

    

const client = twilio(
     process.env.TWILIO_SID,

        process.env.TWILIO_AUTH_TOKEN
)

const message = client.messages.create({

     body: `your Compalint with id: ${complaintId} has been submitted to complaint app.
     Here is link to track your complaint ${link}
     `,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`, 


       

})

console.log("message sent:", message)

return true;

    }


    catch(err){
        console.log(err)
    }

}



export const sendAssignedMessage = (phone,complaintId)=>{

    try{

        const client  = twilio(
               process.env.TWILIO_SID,

        process.env.TWILIO_AUTH_TOKEN
        )


        const message = client.messages.create({
            body:`your complaint with ID: ${complaintId} has been assigned to Officer`,
            from:  process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`, 
        })

return true
        

    }

    catch(err){
        console.log(err)
    }

}



export const sendResolvedMessage = (phone,complaintId,ratingLink)=>{

    try{

        const client  = twilio(
               process.env.TWILIO_SID,

        process.env.TWILIO_AUTH_TOKEN
        )


        const message = client.messages.create({
            body:`your complaint with ID: ${complaintId} has been Resolved! 
            Rate Assigned Officer: ${ratingLink}`,
            from:  process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`, 
        })

return true
        

    }

    catch(err){
        console.log(err)
    }

}






export const officerAssignedComplaint = (phone)=>{

    try{

        const client  = twilio(
               process.env.TWILIO_SID,

        process.env.TWILIO_AUTH_TOKEN
        )


        const message = client.messages.create({
            body:`You have got assigned a complaint `,
            from:  process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`, 
        })

return true
        

    }

    catch(err){
        console.log(err)
    }

}