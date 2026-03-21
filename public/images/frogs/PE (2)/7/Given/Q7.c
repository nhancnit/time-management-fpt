#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
// Fixed Do not edit anything here.
int sumDigits(int n)
{   
//FUNCTION - @STUDENT:ADD YOUR CODE FOR function HERE:
  if (n < 0) {
    n = -n;
  }

  int sum = 0;
  do {
    sum += n % 10;
    n /= 10;
  } while (n > 0);

  // Fixed Do not edit anything here.
  return sum;
}
int main() {
  system("cls");
  int n;
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  scanf("%d", &n);

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  printf("%d", sumDigits(n));

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
