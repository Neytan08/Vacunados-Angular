import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import { PagesService } from '../../services/pages.service';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  arePsycho = false;
  gameId = localStorage.getItem('gameId');
  score : boolean[] = [];
  isCitizen = true;
  playerRol = "";
  playerList:any = [];
  isNotLeader = true;
  psychoMode = true;
  selectedItemsList: any = [];
  checkedIDs: any = [];
  filteredList: any = [];

  actualWeek = 0;

  constructor(public rest:RestService, private pagesService: PagesService) { }

  ngOnInit(): void {
    this.checkPsycho()

    document.getElementById("useMaskButton").style.visibility = "hidden";
    document.getElementById("dontUseMaskButton").style.visibility = "hidden";
  }

  ngOnDestroy(): void {
    this.rolList$.unsubscribe();
  }

  rolList$ = interval(2000).subscribe(() => {
    this.rest.getRound(this.rest.getUsername(), this.gameId, this.rest.getGamePassword()).subscribe((response) => {

        this.score = response.psychoWin;
        let globalScore ="";
        let psychoScore = 0;
        let citizenScore = 0;

        if(response.status == "leader"){
          for(const value of this.score){
            if(value){
              psychoScore += 1;
              globalScore +="P";
            }else{
              citizenScore += 1;
              globalScore +="C";
            }
          }
        }


        if(response.status == "ended" && psychoScore > citizenScore){
          Swal.fire({
            icon: 'success',
            title: "La partida acabó",
            text: "Los psicópatas ganan, eran " + response.psychos
          }).then((result) => {
            if (result.isConfirmed) {
              this.rest.leaveGame();
              this.pagesService.changePage('home');
            }
          });

        }else if(response.status == "ended" &&  psychoScore < citizenScore){
          Swal.fire({
            icon: 'success',
            title: "La partida acabó",
            text: "Los ciudadanos ganan, los psicópatas eran :" + response.psychos
          }).then((result) => {
            if (result.isConfirmed) {
              this.rest.leaveGame();
              this.pagesService.changePage('home');
            }
          });
        }

        document.getElementById("score").innerHTML = globalScore;

        document.getElementById("week").innerHTML = response.rounds.length;
        this.actualWeek =  response.rounds.length;

        if(response.status == "leader"){
          document.getElementById("status").innerHTML = response.status + " " + response.rounds[response.rounds.length-1].leader;
        }else{
          document.getElementById("status").innerHTML = response.status;
        }

        if(response.rounds[response.rounds.length-1].group.length > 0){
          document.getElementById("checkPlayer").style.visibility = "hidden";
        }else{
          if((response.rounds[response.rounds.length-1].leader) == (this.rest.getUsername())){
            document.getElementById("checkPlayer").style.visibility = "visible";
          }else {
            document.getElementById("checkPlayer").style.visibility = "hidden";
          }
        }

        for (var i=0; i<response.rounds[response.rounds.length-1].group.length; i++) {
          if(response.rounds[response.rounds.length-1].group[i].name == this.rest.getUsername() && response.rounds[response.rounds.length-1].group[i].psycho == null){

              if(response.psychos.indexOf(this.rest.getUsername()) != -1){
                document.getElementById("useMaskButton").style.visibility = "visible";
                document.getElementById("dontUseMaskButton").style.visibility = "visible";

              }else {
                document.getElementById("useMaskButton").style.visibility = "visible";
              }

          }
        }


    });
  });;

  checkPsycho(){
    this.rest.getRound(this.rest.getUsername(), this.gameId, this.rest.getGamePassword()).subscribe((response) => {
      document.getElementById("owner").innerHTML = response.owner;
      this.playerList = response.players;

      if(response.owner === this.rest.getUsername()){
        this.isNotLeader = false;
      }

      if(response.rounds[response.rounds.length-1].group.length > 0){
        document.getElementById("checkPlayer").style.visibility = "hidden";
      }else{
        if((response.rounds[response.rounds.length-1].leader) == (this.rest.getUsername())){
          document.getElementById("checkPlayer").style.visibility = "visible";
        }else {
          document.getElementById("checkPlayer").style.visibility = "hidden";
        }
      }

      if(response.psychos.includes(this.rest.getUsername())){
        this.isCitizen = false;
        this.playerRol = this.rest.getUsername() + ", usted es psicópata (" + response.psychos + ")";
      }else{
        this.playerRol = this.rest.getUsername() + ", usted es ciudadano";
      }

    });
  }

  selectPlayer(player:string){
    if(this.selectedItemsList.indexOf(player) == -1){
      this.selectedItemsList.push(player);
    }else{
      this.selectedItemsList.splice(this.selectedItemsList.indexOf(player),1);
    }
  }

  showSelected(){
    alert(this.selectedItemsList)
  }

  checkSelectedList():string{
    let playerCuantity = this.playerList.length;

    if(this.actualWeek == 1){
      if(playerCuantity >= 5 && playerCuantity <= 7 && this.selectedItemsList.length > 2){
        return "El máximo de personas que pueden salir esta semana es de 2";
      }else if(playerCuantity >= 8 && playerCuantity <= 10 && this.selectedItemsList.length > 3) {
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else{
        return "Ok";
      }
    }

    if(this.actualWeek == 2){
      if(playerCuantity >= 5 && playerCuantity <= 7 && this.selectedItemsList.length > 3){
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else if(playerCuantity >= 8 && playerCuantity <= 10 && this.selectedItemsList.length > 4) {
        return "El máximo de personas que pueden salir esta semana es de 4";
      }else{
        return "Ok";
      }
    }

    if(this.actualWeek == 3){
      if(playerCuantity == 5 && this.selectedItemsList.length > 2){
        return "El máximo de personas que pueden salir esta semana es de 2";
      }else if(playerCuantity == 6 && this.selectedItemsList.length > 4) {
        return "El máximo de personas que pueden salir esta semana es de 4";
      }else if(playerCuantity == 7 && this.selectedItemsList.length > 3) {
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else if(playerCuantity >= 8 && playerCuantity <= 10 && this.selectedItemsList.length > 4) {
        return "El máximo de personas que pueden salir esta semana es de 4";
      }else{
        return "Ok";
      }
    }

    if(this.actualWeek == 4){
      if(playerCuantity >= 5 && playerCuantity <= 6 && this.selectedItemsList.length > 3){
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else if(playerCuantity == 7 && this.selectedItemsList.length > 4) {
        return "El máximo de personas que pueden salir esta semana es de 4";
      }else if(playerCuantity >= 8 && playerCuantity <= 10 && this.selectedItemsList.length > 5) {
        return "El máximo de personas que pueden salir esta semana es de 5";
      }else{
        return "Ok";
      }
    }

    if(this.actualWeek == 5){
      if(playerCuantity == 5 && this.selectedItemsList.length > 3) {
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else if(playerCuantity >= 6 && playerCuantity <= 7 && this.selectedItemsList.length > 4){
        return "El máximo de personas que pueden salir esta semana es de 3";
      }else if(playerCuantity >= 8 && playerCuantity <= 10 && this.selectedItemsList.length > 5) {
        return "El máximo de personas que pueden salir esta semana es de 5";
      }else{
        return "Ok";
      }
    }

  }

  groupProposal(){
    let response = this.checkSelectedList();
    if(response == "Ok"){
      this.rest.groupProposal(this.gameId, this.rest.getUsername(), this.rest.getGamePassword(), this.selectedItemsList).subscribe(() => {
      }, (err: any) => {
        console.log(err);
      });
    }else {
      Swal.fire({
        icon: 'error',
        title: "Restricciones del Departamento Nacional de Salud",
        text: response
      })
    }
  }


  goRound(psychoMode:boolean){
    this.rest.goRound(this.gameId, this.rest.getUsername(), this.rest.getGamePassword(), psychoMode).subscribe((response) => {
      document.getElementById("useMaskButton").style.visibility = "hidden";
      document.getElementById("dontUseMaskButton").style.visibility = "hidden";

    }, (err: any) => {
      console.log(err);
    });
  }

  goBack(){
    Swal.fire({
      title: '¿Desea salir de la partida?',
      imageUrl: 'https://cdn.icon-icons.com/icons2/1499/PNG/512/emblemimportant_103451.png',
      imageWidth: 150,
      imageHeight: 150,
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.rest.leaveGame();
        this.pagesService.changePage('home');
      }
    });
  }
}
