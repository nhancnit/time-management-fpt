#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>

int main() {
  system("cls");
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  int n = 0;
  scanf("%d", &n);

  int maxOdd = -1;
  for (int i = 0; i < n; i++) {
    int x;
    scanf("%d", &x);
    if (x % 2 != 0 && (maxOdd == -1 || x > maxOdd)) {
      maxOdd = x;
    }
  }

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  printf("%d", maxOdd);

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
