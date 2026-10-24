#include <stdio.h>
#include <string.h>
#include <ctype.h>
int main(){char k[50],t[200],c[200],d[200];int i,n;printf("Key: ");scanf("%s",k);printf("Text: ");scanf("%s",t);n=strlen(k);
for(i=0;t[i];i++)c[i]=(toupper(t[i])-'A'+toupper(k[i%n])-'A')%26+'A';c[i]=0;
printf("Cipher: %s\n",c);
for(i=0;c[i];i++)d[i]=(c[i]-'A'-(toupper(k[i%n])-'A')+26)%26+'A';d[i]=0;
printf("Decrypted: %s\n",d);return 0;}
