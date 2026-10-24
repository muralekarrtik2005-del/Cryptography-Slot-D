#include <stdio.h>
#include <ctype.h>
int main(){char t[200],s[200];int l=0,i;int K[2][2]={{9,4},{5,7}},V[2][2]={{5,12},{15,25}};
printf("Text: ");scanf("%[^\n]",t);
for(i=0;t[i];i++)if(isalpha(t[i]))s[l++]=tolower(t[i])-'a';if(l%2)s[l++]='x'-'a';
printf("Cipher: ");for(i=0;i<l;i+=2){int a=(K[0][0]*s[i]+K[0][1]*s[i+1])%26,b=(K[1][0]*s[i]+K[1][1]*s[i+1])%26;s[i]=a;s[i+1]=b;printf("%c%c",a+'A',b+'A');}
printf("\nDecrypted: ");for(i=0;i<l;i+=2){int a=(V[0][0]*s[i]+V[0][1]*s[i+1])%26,b=(V[1][0]*s[i]+V[1][1]*s[i+1])%26;printf("%c%c",a+'a',b+'a');}
printf("\n");return 0;}
