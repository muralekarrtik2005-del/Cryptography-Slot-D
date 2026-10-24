#include <stdio.h>
#include <ctype.h>
int main(){char s[200];int a,b,i,inv;
for(a=1;a<26;a++)for(b=0;b<26;b++)if((a*4+b)%26==1&&(a*19+b)%26==20){
for(inv=1;inv<26;inv++)if(a*inv%26==1)break;
printf("a=%d b=%d\n",a,b);printf("Ciphertext: ");scanf("%s",s);printf("Plaintext: ");
for(i=0;s[i];i++)printf("%c",(inv*(toupper(s[i])-'A'-b+26))%26+'a');printf("\n");return 0;}
return 0;}
