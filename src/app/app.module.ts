import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapeBuilderComponent } from './shape-builder/shape-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlsComponent } from './controls/controls.component';
import { ArtboardComponent } from './artboard/artboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ShapeBuilderComponent,
    ControlsComponent,
    ArtboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
