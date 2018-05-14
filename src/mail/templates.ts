import * as sgMail from '@sendgrid/mail'
import {SENDGRID_KEY} from "../mailApiKey";
import {clientUrl, emailSender} from '../constants'

sgMail.setApiKey(SENDGRID_KEY)

export const sendSignUpMail = (email: string, token:string) => {
  const baseUrl = `${clientUrl}/email-confirmation?token=`
  const msg = {
    to: email,
    from: emailSender,
    subject: 'Verify your email for TeXme',
    text: `Hello,\n
             \n
             Thank you for your will to use TexMe!\n\n
             Please go the the link below to confirm your email address
             \n
             ${baseUrl + token}\n\n
             Cheers!`,
    html: `<p>
          Hello,<br/><br/>
             Thank you for your will to use TexMe!<br/><br/>
             Please go to the link below to confirm your email address<br/>
          <a href="${baseUrl + token}">${baseUrl + token}</a><br/><br/>
          Cheers!</p>`,
  }
  return sgMail.send(msg)
}
