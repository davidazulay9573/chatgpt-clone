import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { chatComponent } from './components/pages/chat/chat.component';

export const routes: Routes = [
  { path: 'chat/:id', component: chatComponent },  
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
