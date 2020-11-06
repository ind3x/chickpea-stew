import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    
    constructor (
        public snackBar: MatSnackBar,
        private zone: NgZone) { }
    
    showSuccess (message: string): void {
        this.zone.run(() => {
            this.snackBar.open(message, 'Cerrar', { duration: 4000 });
        });
    }
    
    showError (message: string): void {
        this.zone.run(() => {
            this.snackBar.open(message, 'Cerrar', { panelClass: ['snack-error'], duration: 4000 });
        });
    }
}
