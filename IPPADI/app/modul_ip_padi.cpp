// Modul hitung indek tanam padi dengan metoda analisa trend pertumbuhan padi
// dibuat oleh kegiatan rumah program BIG-Data, IP padi (koordinator: Kustiyo)
// FIXED VERSION: Output only AOI area (cropped results)
// Input : Data Sentinel-1 12 harian, backscatter VH, 60 series (15 + 30 + 15 series), catatan: 1 tahun 30 series
//         File disimpan dalam format ERS, terpisah setiap periode perekaman
//         Dibuat list file input, untuk masukan dalam modul
// Output: 3 gruop file meliputi:
//    1. File Indek Tanam-Panen, 2 digit, XY, X(puluhan): jumlah tanam selama 1 tahun (30 series), Y(satuan): jumlah panen selama 1 tahun ((30 series)
//    2. Waktu Tanam, 1 tahun dibagi 4 (Tri Wulan), DN: waktu tanam: mulai periode 1 sd 30 (catatan: setiap pixel dapat > 1 kali tanam)
//    2. Waktu Panen, 1 tahun dibagi 4 (Tri Wulan), DN: waktu panen: mulai periode 1 sd 30 (catatan: setiap pixel dapat > 1 kali panen)

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <memory.h>
#include <limits.h>
#include <ctype.h>
//#include additions for directory handling
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
//#define maxjk 20000
// Increase to accommodate wide rasters (e.g., ~51k columns in Indonesia mosaic)
#define maxjk 60000
//#define maxjk 60000
#define maxfile 60  // jangan lupa plus 10 untuk prediksi

	FILE *fi[maxfile],*fo[20],*ftxt,*fers,*foers,*fofase[maxfile],*fikar1;
	char nmofase[maxfile][500],nmofaseers[maxfile][500],nmi[1000][500],nmilist[1000][500],nmi_[1000][500],nmo[20][500],nmoers[20][500],nmers[500],nmodir[500],nostr[10],nmoseries[500],nmoseriesers[500],nmodepan[500];
	char outputdir[500];
	int i,ii,iii,j,jj,k,jb,jk,jmlfile,jband,aw,jbandh,kk,qa,ii1,per1sikluspadi,minalldata,maxalldata,Tminalldata,Tmaxalldata,jklstnm,jklspnn,perekstremmin,perekstrempanen;
	int jrk,n0,n1,n2,n3,n4,n5,n,jmlmindata,jmlth,bl,th,sama,a,b,c,d;
	int op,hi,lo,cl,ha,hi1,lo1,ha1,ha2,jmlfilelist,jmlfileinput,jmlfileoutputfitur;
	char nmlistinput[500],strln[500],ssd[500],snol[500],nmiers[500],nmcref[500],nmoindex[500],nmoindexa[500],nmondvi[500],nmowater[500],nmoqa[500],proj[500],intstring[10];
	char nmi1[500],nmi2[500],nmi3[500],nmi4[500],nmi1ers[500],nmi2ers[500],nmi3ers[500],nmi4ers[500],nmo1[500],nmo2[500],nmo3[500],nmo1ers[500],nmo2ers[500],nmo3ers[500],nmidir[500],nmitile[500];
	double lon0,lat0,dimx,dimy,lonmin,lonmax,latmin,latmax;
	double dim,maxnaik,maxturun,btsbedaekstremmaxmin,batasekstremmin;
	// AOI bbox parameters
	double aoi_xmin, aoi_xmax, aoi_ymin, aoi_ymax;
	int aoi_start_row, aoi_end_row, aoi_start_col, aoi_end_col;
	char noprosesS[10],tmps[10],nmikar1[500];
	int noproses,btspanen2,Per_ATMin,MinHujan,MinKemarau,DifKemarauHujan,imin,nmin;
	int ynekstremmin,ynekstremmax,ynpanen,awal,btsatasekstremminimal,Tmin,ketemu,ketemutnm,perekstremmintambahan,pred,perekstremmax;

	unsigned short int dn16bit,bufinp[maxfile][maxjk],bufminmax[3][maxjk],bufkar1[maxjk],bufinptmp[maxfile];
	unsigned char dn8bit,bufout[maxfile][maxjk],buffase[maxfile][maxjk],buffasefinal[maxfile][maxjk];
	unsigned char bufpanen[maxfile][maxjk],bufpanen1[maxfile][maxjk],bufekstremmin[maxfile][maxjk],bufekstremmintambahan[maxfile][maxjk],bufekstremmax[maxfile][maxjk];
	int buftimeminmax[10][maxfile];
	int bedamaxmin,jkosong,jlmkelaspertumbuhanminimum;
	int jb_out, jk_out;
	double lonmin_out, latmax_out;

void tulishasilnbr(void);
void tulisheaderhasil(void);
void bacaheaderinput(void);

// Function to calculate AOI boundaries from geographic coordinates
void hitungAOIBoundaries(void) {
    // Convert geographic coordinates to pixel coordinates
    aoi_start_col = (int)((aoi_xmin - lonmin) / dimx);
    aoi_end_col = (int)((aoi_xmax - lonmin) / dimx);
    aoi_start_row = (int)((latmax - aoi_ymax) / dimy);
    aoi_end_row = (int)((latmax - aoi_ymin) / dimy);
    
    // Ensure boundaries are within image limits
    if (aoi_start_col < 0) aoi_start_col = 0;
    if (aoi_end_col >= jk) aoi_end_col = jk - 1;
    if (aoi_start_row < 0) aoi_start_row = 0;
    if (aoi_end_row >= jb) aoi_end_row = jb - 1;
    
    printf("AOI boundaries calculated:\n");
    printf("  Geographic: X[%.6f, %.6f], Y[%.6f, %.6f]\n", aoi_xmin, aoi_xmax, aoi_ymin, aoi_ymax);
    printf("  Pixel: Row[%d, %d], Col[%d, %d]\n", aoi_start_row, aoi_end_row, aoi_start_col, aoi_end_col);
    printf("  Processing area: %d rows x %d columns\n", 
           aoi_end_row - aoi_start_row + 1, aoi_end_col - aoi_start_col + 1);
}

int  main(int arg_c, char *arg_v[])
{
int kelip;
double tempdob;

printf("Modul Ekstraksi Indek Penanaman Padi by Rumah Program BIG Data- Indek Penanaman Padi (AOI Cropped Output)\n");

if (arg_c < 3) {
	printf("Salah Masukan\n ");
	printf("Sintax:Buat_IP_padi [listdatamasukan_tanpa_ERS] [nama_output] [per1sikluspadi] [perekstremmin] [perekstremmax] [btsbedaekstremmaxmin] [batasekstremmin] [jlmkelaspertumbuhanminimum] [aoi_xmin] [aoi_xmax] [aoi_ymin] [aoi_ymax]\n ");
	printf("contoh:Buat_IP_padi list_ARDsen1_202308_202507.txt Pantura 8 4 4 0.3 0.7 7 110.0 110.1 -6.1 -6.0\n ");
	printf("Parameter opsional (akan menggunakan default jika tidak diberikan):\n");
	printf("  per1sikluspadi: Jarak antar tanam (default: 8)\n");
	printf("  perekstremmin: Jumlah periode kiri/kanan untuk minimum (default: 4)\n");
	printf("  perekstremmax: Jumlah periode kiri/kanan untuk maximum (default: 4)\n");
	printf("  btsbedaekstremmaxmin: Threshold DN max-min (default: 0.3)\n");
	printf("  batasekstremmin: Threshold DN minimum (default: 0.7)\n");
	printf("  jlmkelaspertumbuhanminimum: Jarak tanam-panen (default: 7)\n");
	printf("  aoi_xmin: AOI minimum longitude (default: full image)\n");
	printf("  aoi_xmax: AOI maximum longitude (default: full image)\n");
	printf("  aoi_ymin: AOI minimum latitude (default: full image)\n");
	printf("  aoi_ymax: AOI maximum latitude (default: full image)\n");
	exit(1);
	}
else {
	strcpy(nmlistinput,arg_v[1]);
	strcpy(nmodepan,arg_v[2]);}

// Default output directory and optional override via --outdir=PATH
strcpy(outputdir, "workspace/output");
for (int arg_i = 3; arg_i < arg_c; arg_i++) {
    if (strncmp(arg_v[arg_i], "--outdir=", 9) == 0) {
        strncpy(outputdir, arg_v[arg_i] + 9, sizeof(outputdir) - 1);
        outputdir[sizeof(outputdir) - 1] = '\0';
    }
}

// Setting nilai parameter pertumbuhan padi dengan default values
per1sikluspadi = 8;         // Jarak antar tanam	
perekstremmin=4; 		    // Jumlah periode di kiri/kanan untuk menentukan minimum
perekstremmax=4;			// Jumlah periode di kiri/kanan untuk menentukan maximum
btsbedaekstremmaxmin=0.3;	// Perbedaan nilai DN antara maximum dan minimum selama 60 periode yang digunakan
batasekstremmin=0.7;    	// Nilai DN minimum untuk dianggap sebagai ekstreem minimim = Min + batas*(Max-Min), berlalu lokal, setiap pixel beda nilai batas
jlmkelaspertumbuhanminimum = 7;			// Jarak antara tanam dan panen, menunjukkan jumlah periode antara tanam dan panen

// Parse optional parameters from command line
if (arg_c >= 4) {
    per1sikluspadi = atoi(arg_v[3]);
    if (per1sikluspadi <= 0) {
        printf("Error: per1sikluspadi must be a positive integer. Using default value 8.\n");
        per1sikluspadi = 8;
    }
}

if (arg_c >= 5) {
    perekstremmin = atoi(arg_v[4]);
    if (perekstremmin <= 0) {
        printf("Error: perekstremmin must be a positive integer. Using default value 4.\n");
        perekstremmin = 4;
    }
}

if (arg_c >= 6) {
    perekstremmax = atoi(arg_v[5]);
    if (perekstremmax <= 0) {
        printf("Error: perekstremmax must be a positive integer. Using default value 4.\n");
        perekstremmax = 4;
    }
}

if (arg_c >= 7) {
    btsbedaekstremmaxmin = atof(arg_v[6]);
    if (btsbedaekstremmaxmin <= 0.0 || btsbedaekstremmaxmin >= 1.0) {
        printf("Error: btsbedaekstremmaxmin must be between 0 and 1. Using default value 0.3.\n");
        btsbedaekstremmaxmin = 0.3;
    }
}

if (arg_c >= 8) {
    batasekstremmin = atof(arg_v[7]);
    if (batasekstremmin <= 0.0 || batasekstremmin >= 1.0) {
        printf("Error: batasekstremmin must be between 0 and 1. Using default value 0.7.\n");
        batasekstremmin = 0.7;
    }
}

if (arg_c >= 9) {
    jlmkelaspertumbuhanminimum = atoi(arg_v[8]);
    if (jlmkelaspertumbuhanminimum <= 0) {
        printf("Error: jlmkelaspertumbuhanminimum must be a positive integer. Using default value 7.\n");
        jlmkelaspertumbuhanminimum = 7;
    }
}

// AOI parameters will be handled after reading header

// Print all parameters being used
printf("Using parameters:\n");
printf("  per1sikluspadi = %d\n", per1sikluspadi);
printf("  perekstremmin = %d\n", perekstremmin);
printf("  perekstremmax = %d\n", perekstremmax);
printf("  btsbedaekstremmaxmin = %.2f\n", btsbedaekstremmaxmin);
printf("  batasekstremmin = %.2f\n", batasekstremmin);
printf("  jlmkelaspertumbuhanminimum = %d\n", jlmkelaspertumbuhanminimum);

// Setting jumlah output 
jmlfileinput=60;

///////////////////////////////////////////////////  Baca list file Input
ftxt=fopen(nmlistinput,"rt");
if(ftxt==NULL) {printf("tidak ada file txt list input : %s\n",nmlistinput); exit(1);}
jmlfilelist=0;
for(i=0;i<100;i++){
	fgets(strln,100,ftxt);
	sscanf(strln,"%s ",&snol);
	strcpy(nmi[i],snol);
	if(feof(ftxt)) break;
	jmlfilelist=jmlfilelist+1;
	}
printf("Jumlah file list  			: %d\n",jmlfilelist);
printf("Jumlah file input 			: %d\n",jmlfileinput);
if(jmlfilelist != jmlfileinput){printf("Jumlah file yang dilist harus sama dengan 60\n");exit(1);}

for(i=0;i<jmlfileinput;i++){    
	fi[i]=fopen(nmi[i],"rb"); if(fi[i]==NULL) {printf("tidak ada file input : %s\n",nmi[i]); exit(1);}}
for(i=0;i<jmlfileinput;i++){
	printf("Nama Input %d :%s\n",i+1,nmi[i]);}

// Ensure output directory exists (recursive creation)
{
    char tmpdir[600];
    int len = (int)strlen(outputdir);
    if (len >= (int)sizeof(tmpdir)) len = (int)sizeof(tmpdir) - 1;
    memcpy(tmpdir, outputdir, len);
    tmpdir[len] = '\0';
    for (int i = 1; i < len; i++) {
        if (tmpdir[i] == '/') {
            tmpdir[i] = '\0';
            mkdir(tmpdir, 0777);
            tmpdir[i] = '/';
        }
    }
    mkdir(tmpdir, 0777);
}

// Output file 
jmlfileoutputfitur=9; 	
sprintf(nmo[0], "%s/%s_IP", outputdir, nmodepan);           sprintf(nmoers[0], "%s.ers", nmo[0]);
sprintf(nmo[1], "%s/%s_Tanam_TW1", outputdir, nmodepan);     sprintf(nmoers[1], "%s.ers", nmo[1]);
sprintf(nmo[2], "%s/%s_Tanam_TW2", outputdir, nmodepan);     sprintf(nmoers[2], "%s.ers", nmo[2]);
sprintf(nmo[3], "%s/%s_Tanam_TW3", outputdir, nmodepan);     sprintf(nmoers[3], "%s.ers", nmo[3]);
sprintf(nmo[4], "%s/%s_Tanam_TW4", outputdir, nmodepan);     sprintf(nmoers[4], "%s.ers", nmo[4]);
sprintf(nmo[5], "%s/%s_Panen_TW1", outputdir, nmodepan);     sprintf(nmoers[5], "%s.ers", nmo[5]);
sprintf(nmo[6], "%s/%s_Panen_TW2", outputdir, nmodepan);     sprintf(nmoers[6], "%s.ers", nmo[6]);
sprintf(nmo[7], "%s/%s_Panen_TW3", outputdir, nmodepan);     sprintf(nmoers[7], "%s.ers", nmo[7]);
sprintf(nmo[8], "%s/%s_Panen_TW4", outputdir, nmodepan);     sprintf(nmoers[8], "%s.ers", nmo[8]);

for(i=0;i<jmlfileoutputfitur;i++){
	printf("Nama Output %d :%s\n",i+1,nmoers[i]);}
for(i=0;i<jmlfileoutputfitur;i++){
	fo[i]=fopen(nmo[i],"wb"); if(fo[i]==NULL) {printf("tidak dapat buat file outputfitur:%s\n",nmo[i]); exit(1);}}

// Baca header file Input hanya untuk input pertama saja, input selanjutnya dianggap sama
strcpy(nmiers,nmi[0]); strcat(nmiers,".ers");
bacaheaderinput();
printf(" jb jk jband : %d, %d, %d \n",jb,jk,jband);

// Initialize AOI parameters after reading header
if (arg_c >= 13) {
    // Parse AOI parameters now that lon/lat and dimensions are known
    aoi_xmin = atof(arg_v[9]);
    aoi_xmax = atof(arg_v[10]);
    aoi_ymin = atof(arg_v[11]);
    aoi_ymax = atof(arg_v[12]);

    // Clamp to image bounds
    if (aoi_xmin < lonmin) aoi_xmin = lonmin;
    if (aoi_xmax > lonmin + (jk * dimx)) aoi_xmax = lonmin + (jk * dimx);
    if (aoi_ymin < latmax - (jb * dimy)) aoi_ymin = latmax - (jb * dimy);
    if (aoi_ymax > latmax) aoi_ymax = latmax;

    // Validate order; fallback to full image if invalid
    if (aoi_xmin >= aoi_xmax || aoi_ymin >= aoi_ymax) {
        printf("Warning: AOI parameters invalid; using full image.\n");
        aoi_xmin = lonmin;
        aoi_xmax = lonmin + (jk * dimx);
        aoi_ymin = latmax - (jb * dimy);
        aoi_ymax = latmax;
    }
} else {
    // Use full image if AOI not provided
    aoi_xmin = lonmin;
    aoi_xmax = lonmin + (jk * dimx);
    aoi_ymin = latmax - (jb * dimy);
    aoi_ymax = latmax;
}

// Calculate AOI boundaries
hitungAOIBoundaries();
jb_out = aoi_end_row - aoi_start_row + 1;
jk_out = aoi_end_col - aoi_start_col + 1;
lonmin_out = aoi_xmin;   // anchor X kiri-atas AOI
latmax_out = aoi_ymax;   // anchor Y kiri-atas AOI

printf("AOI boundaries calculated:\n");
printf("  Geographic: X[%.6f, %.6f], Y[%.6f, %.6f]\n", aoi_xmin, aoi_xmax, aoi_ymin, aoi_ymax);
printf("  Pixel: Row[%d, %d], Col[%d, %d]\n", aoi_start_row, aoi_end_row, aoi_start_col, aoi_end_col);
printf("  Output size: %d rows x %d columns (AOI only)\n", jb_out, jk_out);

///////////////  PROSES HITUNG INDEK PENANAMAN PADI: DIBACA dan DIPROSES TIAP BARIS, agar kapasits memory CUKUP
printf("BACA DAN PROSES DATA CITRA (AOI area only): \n");
printf("Processing rows %d to %d (total: %d rows)\n", aoi_start_row, aoi_end_row, aoi_end_row - aoi_start_row + 1);
printf("Processing columns %d to %d (total: %d columns)\n", aoi_start_col, aoi_end_col, aoi_end_col - aoi_start_col + 1);

for(i=aoi_start_row; i<=aoi_end_row; i++){
    kelip=i-(int)(i/10)*10;
    if(kelip==0) printf("baris :%5d\r",i);
	
	///////  Baca Isi file Input - FIXED: Read only AOI area per row
    for(ii=0; ii<jmlfileinput; ii++){
        // Position to start of AOI for this row
        long long offset = (long long)i * (long long)jk + (long long)aoi_start_col;
        fseeko(fi[ii], offset, SEEK_SET);
        
        // Read only AOI columns for this row
        for(j=0; j<jk_out; j++){
            fread(&dn8bit,1,1,fi[ii]);
            dn16bit = dn8bit;
            bufinp[ii][j] = dn16bit;  // Store in 0-based index for AOI
        }
    }

	/////////   Proses tentukan waktu Tanam dan Panen untuk setiap kolom AOI
	for(j=0; j<jk_out; j++){
		/////////////////////////////////////////////////// MINMAX ALL.... Minimum dan Maximum DN selama 60 periode
		minalldata=30000; maxalldata=0;
		for(ii=0;ii<jmlfileinput;ii++){   
			if(minalldata>=bufinp[ii][j]) {minalldata = bufinp[ii][j]; }
			if(maxalldata<=bufinp[ii][j]) {maxalldata = bufinp[ii][j]; }
			}
		bufminmax[0][j]=minalldata; bufminmax[1][j]=maxalldata; bufminmax[2][j]=maxalldata-minalldata;

		/////////////////////////////////////////////////// MIn....Deteksi Ekstreem Minimal awal:     --perekstremmin--ii--perekstremmin--
		for(ii=0;ii<jmlfileinput;ii++) bufekstremmin[ii][j]=0;
		for(ii=perekstremmin;ii<jmlfileinput-perekstremmin;ii++){   			
			ynekstremmin=10;  										// inisaial nilai 10 adalah ekstreem
			for(jj=ii-perekstremmin;jj<ii;jj++){if(bufinp[jj][j]<=bufinp[ii][j]) {ynekstremmin=1; break;}}   	    // periode di kiri (sebelum)
			for(jj=ii;jj<ii+perekstremmin+1;jj++){if(bufinp[ii][j]> bufinp[jj][j]) {ynekstremmin=1; break;}} 		// periode di kanan (setelah)	// +1 agar kiri kanan sama
			bufekstremmin[ii][j]=ynekstremmin;}
		
		/////////////////////////////////////////////////// Max....Deteksi Ekstreem maximum awal
		for(ii=0;ii<jmlfileinput;ii++) bufekstremmax[ii][j]=0;
		for(ii=perekstremmax;ii<jmlfileinput-perekstremmax;ii++){   			
			ynekstremmax=10;  										// inisaial nilai 10 adalah ekstreem
			for(jj=ii-perekstremmax;jj<ii;jj++){if(bufinp[jj][j]>=bufinp[ii][j]) {ynekstremmax=1; break;}}   		// periode di kiri (sebelum)
			for(jj=ii;jj<ii+perekstremmax+1;jj++){if(bufinp[ii][j]< bufinp[jj][j]) {ynekstremmax=1; break;}} 		// periode di kanan (setelah)	
			bufekstremmax[ii][j]=ynekstremmax;}

		/////////////////////////////////////////////////// MIn....Seleksi ulang Ekstreem Minimal awal, Jarak antar ekstrem minimum harus > per1sikluspadi
		for(ii=perekstremmin;ii<jmlfileinput-per1sikluspadi;ii++){    			
			if(bufekstremmin[ii][j]==10){   				// ketemu 10, cari kedepan sejauh --per1sikluspadi--
				for(jj=ii+1;jj<ii+per1sikluspadi;jj++){  
					if(bufekstremmin[jj][j]==10) {
						if(bufinp[ii][j] >= bufinp[jj][j]) {bufekstremmin[ii][j]=3; break;}
						else bufekstremmin[jj][j]=3; 
						}}}} 

		/////////////////////////////////////////////////// MIn....Seleksi ulang Ekstreem Minimal awal,	harus kurang dari btsatasekstremminimal
		for(ii=perekstremmin;ii<jmlfileinput-1;ii++){
			btsatasekstremminimal = bufminmax[0][j] + (batasekstremmin *((int)bufminmax[2][j]));
			if((bufekstremmin[ii][j]==10)&&(bufinp[ii][j]>btsatasekstremminimal)) bufekstremmin[ii][j]=4;
			}
		
		/////////////////////////////////////////////////// Max/Min Perbaikan Nilai ekstrem min dengan memperhitungkan selisih DN Max Min (bedamaxmin) dan ada tidaknya maximum
		//// Jika tidak ada ekstrem maximum yang bersesuaian dihapus sebagai ekstremm minimum
		/// Penyiapan parameer untuk update  waktu tanam panen, dan nilai DN nya
		bedamaxmin = btsbedaekstremmaxmin * (maxalldata-minalldata);
		for(ii=0;ii<5;ii++) for(jj=0;jj<jmlfileinput;jj++) buftimeminmax[ii][jj]=0;
		imin = 0;
		for(ii=0;ii<jmlfileinput;ii++){
			if(bufekstremmin[ii][j]==10) { buftimeminmax[0][imin]=ii; imin=imin+1;}}			// buftimeminmax[0][] : waktu tanam
		nmin = imin;  // Total planting times
		buftimeminmax[0][nmin] = jmlfileinput-1;												// hanya untuk  membantu line dibawahnya agar tanam berikutnya dari tanam terakhir adalah jmlfileinput-1
		// update ekstrem min, syarat: harus ada ekstrem max
		for (imin=0;imin<nmin-1;imin++){    													// catatan: nmin-1 tidak harus ada Maximum
			buftimeminmax[1][imin] = 0;  														// Buffer maximum harus ada buffer minimum, kecuali diakhir
			ketemu=0;  // set tidak ketemu
			for (jj=buftimeminmax[0][imin]+1; jj< buftimeminmax[0][imin+1]; jj++){
				if (bufekstremmax[jj][j] == 10) {buftimeminmax[1][imin] = jj; ketemu=1; break;}}// buftimeminmax[1] : waktu maximim
			if(ketemu==0) buftimeminmax[0][imin] = 6;}  // tidak ketemu maximum
		if (buftimeminmax[1][nmin-1] == 0) buftimeminmax[1][nmin-1] = jmlfileinput-1; 			// untuk membantu kalau tanam terakhir akan mempunyai maximum, isi dengan waktu terakhir
		for (imin=0; imin<(nmin-1); imin++){
			buftimeminmax[4][imin] = (bufinp[buftimeminmax[1][imin]][j] - bufinp[buftimeminmax[0][imin]][j] );} // buftimeminmax[4] : jarak spekral (DN) tanam maximum

		buftimeminmax[0][nmin] = jmlfileinput-1;			
		for(ii=0;ii<jmlfileinput;ii++){
			bufekstremmin[ii][j]=0;
			bufekstremmax[ii][j]=0;}
		for (imin=0; imin<nmin; imin++){
			bufekstremmin[buftimeminmax[0][imin]][j]=10;
			bufekstremmax[buftimeminmax[1][imin]][j]=10;}
			
		/////////////////////////////////////////////////// Panen....Deteksi Panen ( 2 periode seletah ekstrem maximum )
		for (imin=0;imin<nmin;imin++){
			if (buftimeminmax[1][imin]+2 < buftimeminmax[0][imin+1]) buftimeminmax[2][imin] = buftimeminmax[1][imin]+2;  // Buffer panen adalah 2 periode setelah waktu maximum
			else if (buftimeminmax[1][imin]+1 < buftimeminmax[0][imin+1]) buftimeminmax[2][imin] = buftimeminmax[1][imin]+1;
			else buftimeminmax[2][imin] = buftimeminmax[1][imin];
			if  (buftimeminmax[2][imin] >200) buftimeminmax[2][imin]=0; }
		if (buftimeminmax[1][nmin-1] == (jmlfileinput-1)) buftimeminmax[2][nmin-1] = jmlfileinput-1; 			// isi dengan waktu terakhir
		for(ii=0;ii<jmlfileinput;ii++) bufpanen[ii][j]=0;
		for (imin=0; imin<nmin; imin++) bufpanen[buftimeminmax[2][imin]][j]=20;
		for (imin=0; imin<(nmin-1); imin++){
			buftimeminmax[3][imin] = (buftimeminmax[2][imin] - buftimeminmax[0][imin]) + 1;}					// buftimeminmax[3] : jarak tanam ke panen 

		/////////////////////////////////////////////////// Update Panen: Jarak Tanam - Panen harus memenuhi waktu pertumbuhan padi
		// DN =1: Panen; DN=12: Panen
		for(ii=0;ii<jmlfileinput;ii++){buffasefinal[ii][j]=0;}
		for(imin=0;imin<nmin;imin++){
			if((buftimeminmax[2][imin]-buftimeminmax[0][imin]+1)>=jlmkelaspertumbuhanminimum){		// Jika lama periode tumbuh tidak samai jml kelas minimum, dianggap bukan padi
					ii=buftimeminmax[0][imin]; 
					if((ii>0)&&(ii<jmlfileinput)) buffasefinal[ii][j]=1;
					jj=buftimeminmax[2][imin]; 
					if((jj>0)&&(jj<jmlfileinput)) buffasefinal[jj][j]=12;
 					}}
			
		///////////  Selesai Proses tentukan waktu Tanam dan Panen untuk setiap kolom AOI
		}
	

	///////////////// Hitung Indek Penanaman (Tanam-Panen), waktu tanam dan waktu panen untuk AOI
	for(j=0; j<jk_out; j++){
        for(jj=0; jj<jmlfileoutputfitur; jj++) bufout[jj][j]=0;
        jklstnm=0; jklspnn=0;
        for(ii=15; ii<15+30; ii++){
            if(buffasefinal[ii][j]==1)  jklstnm++;
            if(buffasefinal[ii][j]==12) jklspnn++;
        }
        bufout[0][j] = jklstnm*10 + jklspnn;
        for(ii=15; ii<23; ii++) if(buffasefinal[ii][j]==1) { bufout[1][j]=ii-14; break; }
        for(ii=23; ii<30; ii++) if(buffasefinal[ii][j]==1) { bufout[2][j]=ii-14; break; }
        for(ii=30; ii<38; ii++) if(buffasefinal[ii][j]==1) { bufout[3][j]=ii-14; break; }
        for(ii=38; ii<45; ii++) if(buffasefinal[ii][j]==1) { bufout[4][j]=ii-14; break; }
        for(ii=15; ii<23; ii++) if(buffasefinal[ii][j]==12){ bufout[5][j]=ii-14; break; }
        for(ii=23; ii<30; ii++) if(buffasefinal[ii][j]==12){ bufout[6][j]=ii-14; break; }
        for(ii=30; ii<38; ii++) if(buffasefinal[ii][j]==12){ bufout[7][j]=ii-14; break; }
        for(ii=38; ii<45; ii++) if(buffasefinal[ii][j]==12){ bufout[8][j]=ii-14; break; }
    }

    // FIXED: Write only AOI columns (no padding with zeros)
    for(ii=0; ii<jmlfileoutputfitur; ii++){
        for(j=0; j<jk_out; j++){
            dn8bit = bufout[ii][j];
            fwrite(&dn8bit, 1, 1, fo[ii]);
        }
    }
}

printf("== Selesai Proses\n");

for(ii=0;ii<jmlfileinput;ii++) {fclose(fi[ii]);}
for(ii=0;ii<jmlfileoutputfitur;ii++) {fclose(fo[ii]);}

printf("Tulis header hasil %s\n",nmoers[0]);
for(ii=0;ii<jmlfileoutputfitur;ii++) {
	strcpy(nmers, nmoers[ii]); jbandh=1; tulisheaderhasil();}
return(1);
}

// FIXED: tulisheaderhasil() now outputs AOI dimensions only
void tulisheaderhasil(void){
    foers=fopen(nmers,"wt");
    if(foers==NULL) {printf("gagal buat file : %s\n",nmers); exit(1);}
    fprintf(foers,"DatasetHeader Begin\n");
    fprintf(foers,"\tVersion\t\t= \"6.0\"\n");
    fprintf(foers,"\tDataSetType\t= ERStorage\n");
    fprintf(foers,"\tDataType\t= Raster\n");
    fprintf(foers,"\tByteOrder\t= LSBFirst\n");
    fprintf(foers,"\tCoordinateSpace Begin\n");
    fprintf(foers,"\t\tDatum\t\t= \"WGS84\"\n");
    fprintf(foers,"\t\tProjection\t= \"GEODETIC\"\n");
    fprintf(foers,"\t\tCoordinateType\t= EN\n");
    fprintf(foers,"\t\tUnits\t= \"DEGREES\"\n");
    fprintf(foers,"\t\tRotation\t= 0:0:0.0\n");
    fprintf(foers,"\tCoordinateSpace End\n");
    fprintf(foers,"\tRasterInfo Begin\n");
    fprintf(foers,"\t\tCellType\t= Unsigned8BitInteger\n");
    // Output only AOI dimensions
    fprintf(foers,"\t\tNrOfLines\t= %d\n", jb_out);
    fprintf(foers,"\t\tNrOfCellsPerLine\t= %d\n", jk_out);
    fprintf(foers,"\t\tNrOfBands\t= %2d\n", jbandh);
    fprintf(foers,"\t\tNullCellValue\t= 0\n");
    fprintf(foers,"\t\tCellInfo Begin\n");
    fprintf(foers,"\t\t\tXdimension\t= %18.12lf\n", dimx);
    fprintf(foers,"\t\t\tYdimension\t= %18.12lf\n", dimy);
    fprintf(foers,"\t\tCellInfo End\n");
    fprintf(foers,"\t\tRegistrationCoord Begin\n");
    // Anchor to top-left corner of AOI
    fprintf(foers,"\t\t\tEastings\t= %18.12lf\n", lonmin_out);
    fprintf(foers,"\t\t\tNorthings\t= %18.12lf\n", latmax_out);
    fprintf(foers,"\t\tRegistrationCoord End\n");

    // Add AOI information for reference
    fprintf(foers,"\t\tAOI_Info Begin\n");
    fprintf(foers,"\t\t\tOriginal_Image_Rows\t= %d\n", jb);
    fprintf(foers,"\t\t\tOriginal_Image_Cols\t= %d\n", jk);
    fprintf(foers,"\t\t\tAOI_Xmin\t= %18.12lf\n", aoi_xmin);
    fprintf(foers,"\t\t\tAOI_Xmax\t= %18.12lf\n", aoi_xmax);
    fprintf(foers,"\t\t\tAOI_Ymin\t= %18.12lf\n", aoi_ymin);
    fprintf(foers,"\t\t\tAOI_Ymax\t= %18.12lf\n", aoi_ymax);
    fprintf(foers,"\t\t\tAOI_Start_Row\t= %d\n", aoi_start_row);
    fprintf(foers,"\t\t\tAOI_End_Row\t= %d\n", aoi_end_row);
    fprintf(foers,"\t\t\tAOI_Start_Col\t= %d\n", aoi_start_col);
    fprintf(foers,"\t\t\tAOI_End_Col\t= %d\n", aoi_end_col);
    fprintf(foers,"\t\tAOI_Info End\n");

    // DataFile name (without .ers extension and path)
    char nmdata[500];
    strcpy(nmdata, nmers);
    int nmdata_len = (int)strlen(nmdata);
    if (nmdata_len > 4 && strcmp(nmdata + nmdata_len - 4, ".ers") == 0) {
        nmdata[nmdata_len - 4] = '\0';
    }
    char *base = nmdata;
    char *slash = strrchr(nmdata, '/');
    if (slash != NULL) base = slash + 1;
    fprintf(foers,"\t\tDataFile\t= \"%s\"\n", base);
    fprintf(foers,"\tRasterInfo End\n");
    fprintf(foers,"DatasetHeader End\n");
    fclose(foers);
}

void bacaheaderinput(void){
	fers=fopen(nmiers,"rt");
	if(fers==NULL) {printf("tidak ada file ERS : %s\n",nmiers); exit(1);}
	for(i=0;i<200;i++){
		fgets(strln,100,fers);
		sscanf(strln,"%s ",&snol);
		// header Projection
		sama=strcmp("Projection",snol);
		if(sama==0) {
			sscanf(strln,"%s %s %s",&snol,&ssd,&proj);}
		// header file ers  Xdimension
		sama=strcmp("Xdimension",snol);
		if(sama==0) {
			sscanf(strln,"%s %s %lf",&snol,&ssd,&dimx);
			fgets(strln,100,fers);
			sscanf(strln,"%s %s %lf",&snol,&ssd,&dimy);}
		// header file ers jb jk
		sama=strcmp("NrOfLines",snol);
		if(sama==0) {
			sscanf(strln,"%s %s %d",&snol,&ssd,&jb);
			fgets(strln,100,fers);
			sscanf(strln,"%s %s %d",&snol,&ssd,&jk);}
		// header file ers Easting Northing
		sama=strcmp("Eastings",snol);
		if(sama==0) {
			sscanf(strln,"%s %s %lf",&snol,&ssd,&lonmin);
			fgets(strln,100,fers);
			sscanf(strln,"%s %s %lf",&snol,&ssd,&latmax);}
		// header jumlah band
		sama=strcmp("NrOfBands",snol);
		if(sama==0) {
			sscanf(strln,"%s %s %d",&snol,&ssd,&jband);
			}
		}
	fclose(fers);
}