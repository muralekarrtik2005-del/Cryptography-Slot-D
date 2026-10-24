#include <stdio.h>
#include <string.h>
#include <ctype.h>
char m[5][5];
void pos(char c,int*r,int*q){for(int i=0;i<5;i++)for(int j=0;j<5;j++)if(m[i][j]==c){*r=i;*q=j;}}
int main(){char k[80],t[200],s[400],u[26]={0};int n=0,l=0;
printf("Key: ");scanf("%s",k);printf("Text: ");scanf("%s",t);
strcat(k,"ABCDEFGHIKLMNOPQRSTUVWXYZ");
for(int i=0;k[i];i++){char c=toupper(k[i]);if(c=='J')c='I';if(!u[c-'A']){u[c-'A']=1;m[n/5][n%5]=c;n++;}}
for(int i=0;t[i];i++){char c=toupper(t[i]);if(c=='J')c='I';if(!isalpha(c))continue;if(l%2==1&&s[l-1]==c)s[l++]='X';s[l++]=c;}
if(l%2)s[l++]='X';s[l]=0;
for(int i=0;i<l;i+=2){int r1,c1,r2,c2;pos(s[i],&r1,&c1);pos(s[i+1],&r2,&c2);
if(r1==r2){c1=(c1+1)%5;c2=(c2+1)%5;}else if(c1==c2){r1=(r1+1)%5;r2=(r2+1)%5;}else{int x=c1;c1=c2;c2=x;}
printf("%c%c",m[r1][c1],m[r2][c2]);}
printf("\n");return 0;}
