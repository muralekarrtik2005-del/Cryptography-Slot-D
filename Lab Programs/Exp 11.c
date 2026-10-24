#include <stdio.h>
#include <math.h>
int main(){double a=0,b;for(int i=2;i<=25;i++)a+=log2(i);b=a-log2(25);
printf("Total keys 25! = 2^%.1f\nUnique keys 24! = 2^%.1f\n",a,b);return 0;}
