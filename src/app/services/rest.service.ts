import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const DEFAULT_SERVER_ADDRESS = 'http://74.207.228.84:80';
const DEFAULT_TIMEOUT = '10000';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }
  /**
   * Gets the list of games.
   * @returns The get request observable.
   */
  getGameList(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'timeout': DEFAULT_TIMEOUT,
        'Access-Control-Allow-Origin': '*'

      })
    };

    return this.http.get(this.getEndpoint() + 'game/', httpOptions);
  }
  /**
   * Creates a new game.
   * @param username Owner's username.
   * @param gameName Name of the game.
   * @param gamePassword Password of the game (optional)
   * @returns The post request observable.
   */
  createGame(username:string, gameName: string, gamePassword: string) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': username,
      })
    };
    const body = {'name': gameName, 'password': gamePassword}

    return this.http.post<any>(this.getEndpoint() + 'game/create', body, httpOptions);
  }
  /**
   * Extract information for an arbitrary game.
   * @param username Username of the player.
   * @param gameId Id of the game.
   * @param gamePassword Password of the game.
   * @returns The get request observable.
   */
  getRound(username:string, gameId: string, gamePassword: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': username,
        'password': gamePassword,
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.get(this.getEndpoint() + 'game/' + gameId, httpOptions);
  }
  /**
   * Request to join a game.
   * @param gameId ID of the game.
   * @param name Name of the user trying to join the game.
   * @param password Password of the game (Optional).
   * @returns Observable of the method.
   */
  joinGame(gameId: string, name: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': name,
        'password': password
      })
    };
    const body = {}
    return this.http.put(`${this.getEndpoint()}game/${gameId}/join`, body, httpOptions);
      //catchError(this.handleError<any>('joinGame')).pipe();

  }

  gameStart(gameId: string, gameOwner:string, gamePassword:string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': gameOwner,
        'password': gamePassword
      })
    };

    return this.http.head(this.getEndpoint() + 'game/'+ gameId + '/start', httpOptions);
  }

  groupProposal (gameId: string, userName: string,  gamePassword: string, group: []): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': userName,
        'password': gamePassword
      })
    };
    return this.http.post<any>(this.getEndpoint() + 'game/'+ gameId + '/group', JSON.stringify({group}), httpOptions);
  }

  goRound(gameId: string, userName: string, gamePassword: string, psycho: boolean): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'name': userName,
        'password': gamePassword
      })
    };
    return this.http.post<any>(this.getEndpoint() + 'game/'+ gameId + '/go', {psycho}, httpOptions);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /**
   * Saves the username into local storage.
   * @param username to be saved.
   */
  setUsername(username: string) : void {
    localStorage.setItem('username', username);
  }
  /**
   * Gets the username from local storage.
   * @returns string
   */
  getUsername() : string {
    return localStorage.getItem('username');
  }

  /**
   * Saves the game name into local storage.
   * @param gameName name of the game.
   */
  setGameName(gameName: string){
    localStorage.setItem('gameName', gameName);
  }

  /**
   * Gets the game name from local storage.
   */
  getGameName(){
    return localStorage.getItem('gameName');
  }

  /**
   * Saves the game id into local storage.
   * @param gameId id of the game.
   */
  setGameId(gameId: string){
    localStorage.setItem('gameId', gameId);
  }

  /**
   * Gets the game id from local storage.
   */
  getGameId(){
    return localStorage.getItem('gameId');
  }

  /**
 * Saves the game password into local storage.
 * @param gamePassword password of the game.
 */
  setGamePassword(gamePassword: string){
    localStorage.setItem('gamePassword', gamePassword);
  }

  /**
   * Gets the game password from local storage.
   */
  getGamePassword(){
    return localStorage.getItem('gamePassword');
  }

  /**
   * Saves the custom server address from local storage.
   * @returns string
   */
  setCustomServerAddress(address: string) : void {
    address = this.parseAddress(address)
    localStorage.setItem('customServerAddress', address);
    localStorage.setItem('useDefaultServer', 'true');
  }
  /**
   * Gets the custom server address from local storage.
   * @returns string
   */
  getCustomServerAddress() : string {
    return localStorage.getItem('customServerAddress');
  }
  /**
   * Parses the address.
   * - Sets the address in lower case without spaces.
   * @param address address to be parsed.
   * @returns
   */
  private parseAddress(address: string): string {
    address = address.toLocaleLowerCase().trim();

    return address;
  }
  /**
   * Checks if the server selected to been used is the default one.
   * @returns  True if the selected server is the default server, false otherwise.
   */
  getUseDefaultServer(): boolean {
    const useDefaultServer = localStorage.getItem('useDefaultServer');
    return useDefaultServer == null || useDefaultServer == 'true';
  }
  /**
   * Checks if the server selected to been used is the default one.
   * @returns  True if the selected server is the default server, false otherwise.
   */
   setUseDefaultServer(status: boolean): void {
    localStorage.setItem('useDefaultServer', status.toString());
  }
  getDefaultServerAddress(): string {
    return DEFAULT_SERVER_ADDRESS;
  }
  /**
   * Gets the endpoint api.
   * @returns
   */
  private getEndpoint(): string {

    let endpoint: string;
    if(this.getUseDefaultServer()){
      endpoint = DEFAULT_SERVER_ADDRESS;
    } else {
      endpoint = this.getCustomServerAddress();
    }
    return `${endpoint}/`;
  }
  /**
   * Deletes all the data in localStorage.
   */
  deleteData(): void {
    localStorage.clear();
  }
  /**
   * Removes the game data.
   */
  leaveGame(): void {
    localStorage.removeItem('gameId');
    localStorage.removeItem('gameName');
    localStorage.removeItem('gamePassword');
  }
  isConnected(): any {
    return this.getGameList();
  }
}
