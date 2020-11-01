import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapeBuilderComponent } from './shape-builder/shape-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlsComponent } from './controls/controls.component';
import { ArtboardComponent } from './artboard/artboard.component';
import { CollapsibleWellComponent } from './collapsible-well/collapsible-well.component';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [
    AppComponent,
    ShapeBuilderComponent,
    ControlsComponent,
    ArtboardComponent,
    CollapsibleWellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
