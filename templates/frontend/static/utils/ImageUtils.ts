import { Observable } from 'rxjs';

export const imageUtils = {
    getImageType: ($event: Event): string => {
        const fileInput: HTMLInputElement = $event.currentTarget as HTMLInputElement;
        return fileInput.files[0].type;
    },
    toBase64String: ($event: Event): Observable<string> => {
        const fileInput: HTMLInputElement = $event.currentTarget as HTMLInputElement;
        return new Observable<string>(subscriber => {
            const image = fileInput.files[0].slice();
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => {
                subscriber.next((reader.result as string).split(',')[1]);
                subscriber.complete();
            };
        });
    }
};
