import { APIRequestContext } from "@playwright/test";

export function getDaysDifference(dateString1: string, dateString2: string): string {
    const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    const date1 = parseDate(dateString1);
    const date2 = parseDate(dateString2);

    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return diffInDays.toString();
}


export function getDateShiftingOfToday(shifting: number, format: string = 'en-GB'): string {
    if (shifting === 0) return new Date().toLocaleDateString(format);
    else return (new Date(new Date().setDate(new Date().getDate() + shifting)).toLocaleDateString(format))
}


export function getRandomString(length: number): string {
    if (length <= 0) return "";

    const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}
