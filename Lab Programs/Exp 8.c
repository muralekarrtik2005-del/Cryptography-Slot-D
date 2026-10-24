#include <stdio.h>
#include <ctype.h>
int main(){char k[30],s[200],a[27];int u[26]={0},n=0,i;printf("Keyword: ");scanf("%s",k);printf("Text: ");scanf("%s",s);
for(i=0;k[i];i++){int c=toupper(k[i])-'A';if(!u[c]){u[c]=1;a[n++]=c+'A';}}
for(i=0;i<26;i++)if(!u[i])a[n++]=i+'A';a[n]=0;
printf("Cipher alphabet: %s\nCipher: ",a);for(i=0;s[i];i++)printf("%c",a[tolower(s[i])-'a']);
printf("\nDecrypted: ");for(i=0;s[i];i++){char c=toupper(s[i]);int j=0;while(a[j]!=c)j++;printf("%c",'a'+j);}
printf("\n");return 0;}
