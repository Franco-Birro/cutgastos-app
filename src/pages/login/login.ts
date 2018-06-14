import { Credenciais } from './../../models/login';
import { TabsPage } from './../tabs/tabs';
import { CadastroPage } from './../cadastro/cadastro';
import { JsonReturn } from './../../models/jsonReturn';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { SessionProvider } from '../../providers/session/session';
import { Usuario } from '../../models/usuario';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  public propEmail: string;
  public propSenha: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    public alertCtrl: AlertController,
    public session: SessionProvider
  ) {}

  ionViewDidLoad() {
    //On init
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control("", [Validators.required]),
      senha: this.formBuilder.control("", [Validators.required])
    });
  }

  onClickEntrar(){
    //Chama o provider que autentica o usuário
    let c = Object.assign(new Credenciais, this.loginForm.value);
    //let c = JSON.stringify(this.loginForm.value);
    console.log(c);

    let loading = this.loadingCtrl.create({
      content: 'Calma...'
    });
    loading.present();
    
     //Para realização de testes do funcionamento provider de sessão:
    /*let u = Object.assign(new Usuario,{
      "id":"4",
      "nome": "teste",
      "cpf": "111111111",
      "email":"teste@gmail.com",
      "senha":123
    });

    this.session.create(u);
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.push(TabsPage);
    */

    this.authServiceProvider.autentication(c).subscribe((response: JsonReturn) => {
      if(response.status === "SUCESSO"){
        //Login correto
        let usuario = Object.assign(new Usuario, response.data);
        this.session.create(usuario);
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Bem Vindo '+response.data.nome+' !!!',
          subTitle: response.message.toString(),
          buttons: ['OKAY']
        });
        alert.present();
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.push(TabsPage);
      }
      else{
        //Tratamento de erro
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Aceite seu destino!!',
          subTitle: response.message.toString(),
          buttons: ['OKAY']
        });
        alert.present();
      }
    });
  }

  onClickNovaConta(){
    //Redireciona para a tela de cadastro.
    this.navCtrl.push(CadastroPage);
  }

}
