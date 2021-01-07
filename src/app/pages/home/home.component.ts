import { Component, OnInit, TemplateRef } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import { AnimalService } from 'src/app/services/animal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  idLog = 'HomeComponent';

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false
  });

  faTrash = faTrash;
  submitted = false;
  btnLoad: Boolean = false;
  modalRef: BsModalRef;

  animals: Array<any> = [];
  animal = {
    name: '',
    description: '',
    image: '',
    imageName: '',
    type: ''
  };
  image = '';

  progress = 0;
  flags = {
    error: false,
    ok: false
  };

  TYPES: Array<any> = [
    { text: 'Mamifero', value: 'MAMMAL' },
    { text: 'Ave', value: 'BIRD' },
    { text: 'Pez', value: 'FISH' }
  ];

  constructor(private animalService: AnimalService, private modalService: BsModalService, private logger: LoggerService) { }

  ngOnInit(): void {
    this.getAllAnimals();
  }

  openModal(template: TemplateRef<any>): void{
    this.submitted = false;
    this.progress = 0;
    this.flags = {
      ok: false,
      error: false
    };
    this.animal = {
      type: '',
      description: '',
      image: '',
      imageName: '',
      name: ''
    };
    this.image = '';
    this.modalRef = this.modalService.show(template);
  }

  getAllAnimals(): void{
    this.animalService.getAll().subscribe((res: any) => {
      this.logger.info(this.idLog, 'getAllAnimals', {info: 'Success', response: res});
      this.animals = res.animals;
    }, err => {
      this.logger.error(this.idLog, 'getAllAnimals', {info: 'Error', error: err});
    });
  }

  saveAnimal(): void{
    this.submitted = true;
    if (this.animal.name.trim() == '' || this.animal.description.trim() == '' || this.animal.type == '' || this.animal.image == '') {
      return;
    }

    this.btnLoad = true;
    this.animalService.save(this.animal).subscribe(res => {
      this.logger.info(this.idLog, 'saveAnimal', {info: 'Success', response: res});
      this.btnLoad = false;
      this.Toast.fire({icon: 'success', title: 'Animal agregado'});
      this.modalRef.hide();
      this.getAllAnimals();
    }, err => {
      this.logger.error(this.idLog, 'saveAnimal', {info: 'Error', error: err});
      const msg = err.error && err.error.message ? err.error.message : 'Error al agregar animal, intente más tarde';
      this.btnLoad = false;
      Swal.fire({icon: 'error', title: msg});
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.progress = 0;
      this.flags = {
        ok: false,
        error: false
      };
      const interval = setInterval(() => {
        if (this.progress < 99){
          this.progress++;
        }
      }, 500);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        const request = {
          fileName: Date.now() + '.' + event.target.files[0].name.split('.')[1],
          file: e.target.result.split(',')[1].toString()
        };
        this.animalService.saveImage(request).subscribe((res: any) => {
        this.logger.info(this.idLog, 'onSelectFile', {info: 'Success', response: res});
        this.animal.image = res.url;
        this.animal.imageName = request.fileName;
        this.progress = 100;
        setTimeout(() => {
          clearInterval(interval);
          this.flags.ok = true;
          }, 1000);
        }, err => {
        this.logger.error(this.idLog, 'onSelectFile', {info: 'Error', error: err});
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => {
            this.flags.error = true;
          }, 1000);
        });
      };
    }
  }


  deleteAnimal(a: any): void{
    this.btnLoad = true;
    this.animalService.delete(a._id).subscribe(res => {
      this.Toast.fire({icon: 'success', title: 'Animal eliminado'});
      this.btnLoad = false;
      this.getAllAnimals();
    }, err => {
      const msg = err.error && err.error.message ? err.error.message : 'Error al eliminar animal, intente más tarde';
      this.btnLoad = false;
      Swal.fire({icon: 'error', title: msg});
    });
  }

}
