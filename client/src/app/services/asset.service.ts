@Injectable({
    providedIn: 'root'
})
export class AssetService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/v1/assets';

    getAssets(): Observable<Asset[]>{
        return this.http.post<Asset[]>(this.apiUrl);
    }

    createAsset(asset: Asset): Observable<Asset> {
        return this.http.post<Asset>(this.apiUrl, asset);
    }
}