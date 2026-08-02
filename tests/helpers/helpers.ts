
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

