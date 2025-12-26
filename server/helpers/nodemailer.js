
import nodemailer from "nodemailer"

const transporter = ()=>{

const transport  = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    }
})

return transport

}



export const sendMail = async(to,otp)=>{


    try{

    const transport = transporter();

    await transport.sendMail({
        from: process.env.USER_EMAIL,
        to,
        subject:"complaint sathi  otp verification",
        text:`your otp for viomeos is ${otp} `
    })

}

catch(err){
    console.log(err)
} 

}



export const sendYearlyIncentiveReportToAdmin = async(url, to)=>{
    try{

        const transport  = transporter();

        transport.sendMail({
            from: process.env.USER_EMAIL,
            to,
            subject:"Complaint Sathi Employee report",
           html: `
      <h2>Your yearly incentive report is ready.</h2>
      <p>Download below:</p>
      <a href="${url}" target="_blank">Download Excel File</a>
    `,
        })

    }

    catch(err){
        console.log(err)
    }
}


export const officerAssignedComplaintMail = async(to,name)=>{
    try{

        const transporter  = transporter();

       await transporter.sendMail({
            from:process.env.USER_EMAIL,
            to,
            subject:`Dear ${name} you have assigned a complaint `,
              text:`you have assigned a complaint, Kindly resolve it at soon as possible. `
        })

    }

    catch(err){
        console.log(err)
    }
}