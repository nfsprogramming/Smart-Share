import type { CardData } from '../types';

export function generateVCard(data: CardData): string {
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${data.fullName}`,
        `N:${data.fullName.split(' ').reverse().join(';')};;;`,
        data.jobTitle ? `TITLE:${data.jobTitle}` : '',
        data.company ? `ORG:${data.company}` : '',
        data.contactInfo?.email ? `EMAIL;TYPE=WORK,INTERNET:${data.contactInfo.email}` : '',
        data.contactInfo?.phone ? `TEL;TYPE=CELL:${data.contactInfo.phone}` : '',
        data.contactInfo?.website ? `URL:${data.contactInfo.website}` : '',
        data.location ? `ADR;TYPE=WORK:;;${data.location};;;;` : '',
    ];

    // Add social links as URLs
    data.links.filter(l => l.active).forEach(link => {
        if (link.url.startsWith('http')) {
            vcard.push(`URL;type=${link.title}:${link.url}`);
        }
    });

    // Add Avatar (if base64) - note: might make file large, keeping it simple for now
    // if (data.avatarUrl.startsWith('data:image')) {
    //     vcard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${data.avatarUrl.split(',')[1]}`);
    // }

    vcard.push('END:VCARD');

    return vcard.filter(line => line).join('\n');
}
