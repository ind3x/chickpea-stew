import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CardWrapperComponent } from './card-wrapper/card-wrapper.component';

@NgModule({
    declarations: [HeaderComponent, CardWrapperComponent],
    exports: [
        HeaderComponent,
        CardWrapperComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class ComponentsModule {}
