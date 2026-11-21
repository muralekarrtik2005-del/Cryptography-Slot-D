#include <stdio.h>
typedef unsigned char B;
B PC2[48]={14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32};
int main(){int u[57]={0},i,a=1,b=1;
for(i=0;i<24;i++){if(PC2[i]>28)a=0;u[PC2[i]]=1;}
for(i=24;i<48;i++){if(PC2[i]<=28)b=0;u[PC2[i]]=1;}
printf("First 24 bits of subkey all come from C (bits 1-28): %s\n",a?"YES":"NO");
printf("Last 24 bits of subkey all come from D (bits 29-56): %s\n",b?"YES":"NO");
printf("Unused bits of C: ");for(i=1;i<=28;i++)if(!u[i])printf("%d ",i);
printf("\nUnused bits of D: ");for(i=29;i<=56;i++)if(!u[i])printf("%d ",i);printf("\n");return 0;}
