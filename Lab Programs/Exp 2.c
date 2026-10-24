#include <stdio.h>
#include <ctype.h>
int main(){char key[27],s[200],r[200];int i;printf("26-letter key: ");scanf("%s",key);printf("Text: ");scanf("%s",s);
for(i=0;s[i];i++)r[i]=isalpha(s[i])?toupper(key[tolower(s[i])-'a']):s[i];r[i]=0;
printf("Cipher: %s\n",r);
for(i=0;r[i];i++){char c=r[i];for(int j=0;j<26;j++)if(toupper(key[j])==c){c='a'+j;break;}s[i]=c;}s[i]=0;
printf("Decrypted: %s\n",s);return 0;}
