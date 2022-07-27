import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '../../services/pages.service';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-create-find-game',
  templateUrl: './create-find-game.component.html',
  styleUrls: ['./create-find-game.component.css']
})
export class CreateFindGameComponent implements OnInit {

  form: FormGroup;

  constructor(private pagesService: PagesService,
              private restService: RestService,
              private formBuilder: FormBuilder) { 
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });
  }

  loadForm(): void {
    this.form.setValue({'username': this.restService.getUsername()});
  }

  goBack(){
    this.pagesService.changePage('home');
  }

  get usernameInvalid(): boolean {
    return this.form.get('username').invalid && this.form.get('username').touched;
  }

  onSubmit(option: string): void {
    
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(control => control.markAllAsTouched());
    } 
    
    this.restService.setUsername(this.form.get('username').value);
        
    if (option == 'create-game') { 
      this.pagesService.changePage('create-game');
    } else if (option == 'search-game'){
      this.pagesService.changePage('find-game');
    }
  }
}
