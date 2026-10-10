#include <stdio.h>
#include <ctype.h>
int main(){char s[200];
int k;printf("Text: ");
scanf("%[^\n]",s);
printf("Key(1-25): ");
scanf("%d",&k);
for(int i=0;
s[i];i++){if(isupper(s[i]))s[i]=(s[i]-'A'+k)%26+'A';
else if(islower(s[i]))s[i]=(s[i]-'a'+k)%26+'a';}
printf("Cipher: %s\n",s);
for(int i=0;s[i];i++){if(isupper(s[i]))s[i]=(s[i]-'A'-k+26)%26+'A';
else if(islower(s[i]))s[i]=(s[i]-'a'-k+26)%26+'a';}
printf("Decrypted: %s\n",s);return 0;}
