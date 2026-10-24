#include <stdio.h>
#include <string.h>
#include <ctype.h>
char m[5][5];
void pos(char c,int*r,int*q){for(int i=0;i<5;i++)for(int j=0;j<5;j++)if(m[i][j]==c){*r=i;*q=j;}}
int main(){char k[80]="ROYALNEWZEALANDNAVY",t[200]="KXJEYUREBEZWEHEWRYTUHEYFSKREHEGOYFIWTTTUOLKSYCAJPOBOTEIZONTXBYBNTGONEYCUZWRGDSONSXBOUYWRHEBAAHYUSEDQ",u[26]={0};int n=0;
strcat(k,"ABCDEFGHIKLMNOPQRSTUVWXYZ");
for(int i=0;k[i];i++){char c=k[i];if(c=='J')c='I';if(!u[c-'A']){u[c-'A']=1;m[n/5][n%5]=c;n++;}}
for(int i=0;t[i];i+=2){int r1,c1,r2,c2;pos(t[i],&r1,&c1);pos(t[i+1],&r2,&c2);
if(r1==r2){c1=(c1+4)%5;c2=(c2+4)%5;}else if(c1==c2){r1=(r1+4)%5;r2=(r2+4)%5;}else{int x=c1;c1=c2;c2=x;}
printf("%c%c",m[r1][c1],m[r2][c2]);}
printf("\n");return 0;}
