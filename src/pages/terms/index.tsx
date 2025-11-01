const restrictionText = `# Rhythia Terms of Service

Last Updated: February 2, 2025

**Rhythia SRL** is offering you a service, which is conditioned on your acceptance, without any modification whatsoever to the following terms, conditions, and notices.

By visiting and/or using the services offered by this site (https://rhythia.com), the Rhythia game client or any affiliated services (henceforth referenced as "**Rhythia**"), you are acknowledging your full compliance to the terms and conditions listed here.

As a condition of your use of this website, you warrant that you will not use this website, or any of the content obtained from this website, for any purpose that is unlawful or prohibited by these terms.

In addition to this policy, please also make sure to visit and understand our Privacy Policy.

If you violate any of these Terms of Use, your permission to use the website automatically terminates.

## DESCRIPTION OF SERVICE

Rhythia provides online gameplay services free of charge to end users, along with online rankings, listings and means of communication. Rhythia also provides users with a means of hosting user created content allowing other users to gain access to uploaded content.

The Rhythia management make no guarantees as to whether any user-uploaded content and information is accurate, current, or of substantial quality. We assume no responsibility as to whether objectionable content has been uploaded. We assume no responsibility over whether users have the rights to distribute uploaded content.

## MODIFICATIONS TO TERMS OF SERVICE

Rhythia may change the terms and conditions of the TOS from time to time. Your failure to abide by the modified TOS may result in termination of your Rhythia Service.

User's continued use of the Service constitutes: (1) an acknowledgment by User of the TOS and its modifications; and (2) an agreement by User to abide and be bound by the TOS and its modifications.

## MODIFICATIONS TO SERVICE

Rhythia reserves the right to modify or discontinue the Service with or without notice to User. Rhythia shall not be liable to User or any third party should Rhythia exercise its right to modify or discontinue the Service.

## DISCLAIMER OF WARRANTIES

USER EXPRESSLY AGREES THAT USE OF THE SERVICE IS AT USER'S SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. YOU UNDERSTAND AND EXPRESSLY AGREE THAT USE OF RHYTHIA'S SERVICES ARE AT YOUR SOLE RISK, THAT ANY MATERIAL AND/OR DATA DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF RHYTHIA'S SERVICES IS AT YOUR OWN DISCRETION AND RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF SUCH MATERIAL AND/OR DATA.

EXCEPT AS EXPRESSLY SET FORTH ON OUR SITES, RHYTHIA DISCLAIMS ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT OR TITLE AND IT MAKES NO WARRANTY OR REPRESENTATION REGARDING THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF RHYTHIA'S SERVICES, REGARDING THE ACCURACY OR RELIABILITY OF ANY INFORMATION OBTAINED THROUGH RHYTHIA'S SERVICES, REGARDING ANY GOODS OR SERVICES PURCHASED OR OBTAINED THROUGH RHYTHIA'S SERVICES, REGARDING ANY TRANSACTIONS ENTERED INTO THROUGH RHYTHIA'S SERVICES OR THAT RHYTHIA'S SERVICES WILL MEET ANY USER'S REQUIREMENTS, BE UNINTERRUPTED, TIMELY, SECURE OR ERROR FREE.

## LIMITATION OF LIABILITY

IN NO EVENT SHALL RHYTHIA, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF OUR WEBSITE, (III) ANY UNAUTHORISED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (IV) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR WEBSITE, (V) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH MAY BE TRANSMITTED TO OR THROUGH OUR WEBSITE BY ANY THIRD PARTY, AND/OR (VI) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE RHYTHIA WEBSITE.

## INDEMNITY

You agree to defend, indemnify and hold harmless Rhythia, its parent corporation, officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Rhythia Website; (ii) your violation of any term of these Terms of Service; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that one of your User Submissions caused damage to a third party.

## USER SUBMISSIONS AND CONTENT REMOVAL

You shall be solely responsible for your own User Submissions and the consequences of posting or publishing them. In connection with User Submissions, you affirm, represent, and/or warrant that: you own or have the necessary licenses, rights, consents, and permissions to use and authorize Rhythia to use all patent, trademark, trade secret, copyright or other proprietary rights in and to any and all User Submissions.

Rhythia does not endorse any User Submission or any opinion, recommendation, or advice expressed therein, and Rhythia expressly disclaims any and all liability in connection with User Submissions. Rhythia reserves the right to remove Content and User Submissions without prior notice.

## PRIVACY POLICIES

Rhythia finds your privacy most important, and we value your use of our services. Rhythia's services are free of any charge, no prior registration is needed for the use of these services. For any privacy-related concerns, please contact rhythiaa@gmail.com.

## PROPRIETARY RIGHTS TO CONTENT

User acknowledges that content, including but not limited to text, software, music, sound, photographs, video, graphics, name references or other material contained in either sponsor advertisements search results, provided to or accessed by User via the Service ("Content") by Rhythia, is protected by copyrights, trademarks, service marks, patents or other proprietary rights and laws; therefore, User is only permitted to use this Content as expressly authorized by the Service.

## CONTACT

For any questions regarding these Terms of Service, please contact rhythiaa@gmail.com.`;
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function RenderCopy() {
  return (
    <Markdown
      className={
        "prose prose-sm dark:prose-invert prose-neutral dark min-w-full prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 overflow-hidden relative"
      }
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {restrictionText}
    </Markdown>
  );
}
